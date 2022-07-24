import 'package:campaign_keeper_mobile/components/app_bar/keeper_floating_search.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/components/keeper_drawer_dialog.dart';
import 'package:campaign_keeper_mobile/components/keeper_graph_view.dart';
import 'package:campaign_keeper_mobile/components/keeper_interactive_viewer.dart';
import 'package:campaign_keeper_mobile/components/keeper_scaffold.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/entities/event_ent.dart';
import 'package:campaign_keeper_mobile/entities/object_ent.dart';
import 'package:campaign_keeper_mobile/entities/session_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/search_controllers/event_search_controller.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';

// Page displaying map of events in the current session.
// Allows to show details of a particular event or
// use a FAB to view a root node.
class SessionMap extends StatefulWidget {
  const SessionMap({Key? key, required this.sessionId}) : super(key: key);
  final int sessionId;

  @override
  State<SessionMap> createState() => _SessionMapState();
}

class _SessionMapState extends KeeperState<SessionMap> {
  final controller = KeeperDrawerDialogController();
  final startKey = GlobalKey();
  bool isLoaded = false;
  late List<EventEntity> events = DataCarrier().getList<EventEntity>(groupId: widget.sessionId);
  late var searchController = EventSearchController(sessionId: widget.sessionId);
  late SessionEntity? session = DataCarrier().get(entId: widget.sessionId);

  Future<void> refresh() async {
    await Future.wait([
      DataCarrier().refresh<UserDataEntity>(),
      DataCarrier().refresh<CampaignEntity>(),
      DataCarrier().refresh<ObjectEntity>(
          parameterName: EntityParameter.campaign, parameterValue: session?.campaignId),
      DataCarrier().refresh<SessionEntity>(parameterValue: session?.campaignId),
      DataCarrier().refresh<EventEntity>(parameterValue: widget.sessionId),
    ]);
  }

  void onSessionRefresh() async {
    SessionEntity? entity = DataCarrier().get(entId: widget.sessionId);
    if (entity == null) {
      returnTo('/start');
    } else {
      updateGraph();
    }
  }

  void onObjectRefresh() {
    updateGraph();
  }

  void onEventRefresh() {
    updateGraph();
  }

  void updateGraph() {
    if (this.mounted) {
      setState(() {
        events = DataCarrier().getList<EventEntity>(groupId: widget.sessionId);
      });
    }
  }

  void fabOnPressed() {
    var rootEvents = events.where((e) => e.parentIds.isEmpty).toList();

    if (rootEvents.length == 1) {
      var entity = rootEvents[0];
      Navigator.of(context).pushNamed('/start/campaign/session_map/event_explorer', arguments: entity.id);
    } else if (rootEvents.length > 1) {
      controller.openDrawer(
        "Choose event",
        rootEvents.length,
        (context, id) => KeeperDrawerTile(
          child: ListTile(
            title: Text(rootEvents[id].title),
          ),
          onTap: () {
            var entity = rootEvents[id];
            Navigator.of(context)
                .pushNamed('/start/campaign/session_map/event_explorer', arguments: entity.id);
          },
        ),
      );
    }
  }

  void refreshGraph() async {
    setState(() {
      isLoaded = false;
    });

    await refresh();

    setState(() {
      isLoaded = true;
    });
  }

  void onPopupSelected(dynamic value) {
    if (value == 'Refresh') {
      refreshGraph();
    }
  }

  @override
  void onReturn() {
    DataCarrier().refresh<SessionEntity>(parameterValue: session?.campaignId);
    DataCarrier()
        .refresh<ObjectEntity>(parameterName: EntityParameter.campaign, parameterValue: session?.campaignId);
    DataCarrier().refresh<EventEntity>(parameterValue: widget.sessionId);
  }

  @override
  void onEveryResume() {
    refreshGraph();
  }

  @override
  void initState() {
    super.initState();
    DataCarrier().addListener<SessionEntity>(onSessionRefresh);
    DataCarrier().addListener<ObjectEntity>(onObjectRefresh);
    DataCarrier().addListener<EventEntity>(onEventRefresh);
    refreshGraph();
  }

  @override
  void dispose() {
    DataCarrier().removeListener<SessionEntity>(onSessionRefresh);
    DataCarrier().removeListener<ObjectEntity>(onObjectRefresh);
    DataCarrier().removeListener<EventEntity>(onEventRefresh);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return KeeperDrawerDialog(
      controller: controller,
      child: KeeperScaffold(
        body: KeeperFloatingSearch(
          searchController: isLoaded ? searchController : null,
          popup: KeeperPopup.settings(
            context,
            itemBuilder: (context) => [
              PopupMenuItem<String>(
                value: 'Refresh',
                child: Text("Refresh"),
              )
            ],
            onSelected: onPopupSelected,
          ),
          child: !isLoaded
              ? Center(
                  child: SpinKitRing(
                    color: Theme.of(context).colorScheme.onBackground,
                    size: 40.0,
                    lineWidth: 5.0,
                  ),
                )
              : KeeperInteractiveViewer(
                  centerKey: startKey,
                  child: KeeperGraphView(
                    session: session,
                    events: events,
                    startKey: startKey,
                  ),
                ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: isLoaded ? fabOnPressed : null,
          backgroundColor: isLoaded
              ? Theme.of(context).colorScheme.primary
              : Color.alphaBlend(Theme.of(context).colorScheme.onPrimary.withOpacity(0.1),
                  Theme.of(context).colorScheme.primary),
          child: Icon(Icons.article_outlined),
        ),
      ),
    );
  }
}
