import 'package:campaign_keeper_mobile/components/app_bar/keeper_floating_search.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/components/keeper_drawer_dialog.dart';
import 'package:campaign_keeper_mobile/components/keeper_graph_view.dart';
import 'package:campaign_keeper_mobile/components/keeper_interactive_viewer.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/entities/event_ent.dart';
import 'package:campaign_keeper_mobile/entities/object_ent.dart';
import 'package:campaign_keeper_mobile/entities/session_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';

// Page displaying map of events in the current session.
// Allows to show details of a particular event or
// use a FAB to show the first, root one.
class SessionMap extends StatefulWidget {
  const SessionMap({Key? key, required this.sessionId}) : super(key: key);
  final int sessionId;

  @override
  State<SessionMap> createState() => _SessionMapState();
}

class _SessionMapState extends KeeperState<SessionMap> {
  final controller = KeeperDrawerDialogController();
  final startKey = GlobalKey();
  int loadBit = 0;
  List<EventEntity> events = [];
  late SessionEntity? session = DataCarrier().get(entId: widget.sessionId);

  Future<void> refresh() async {
    DataCarrier().refresh<UserDataEntity>();
    DataCarrier().refresh<CampaignEntity>();
    DataCarrier()
        .refresh<ObjectEntity>(parameterName: EntityParameter.campaign, parameterValue: session?.campaignId)
        .whenComplete(onObjectRefresh);
    DataCarrier().refresh<SessionEntity>(parameterValue: session?.campaignId).whenComplete(onSessionRefresh);
    DataCarrier().refresh<EventEntity>(parameterValue: widget.sessionId).whenComplete(onEventRefresh);
  }

  void onSessionRefresh() async {
    SessionEntity? entity = DataCarrier().get(entId: widget.sessionId);
    if (entity == null) {
      returnTo('/start');
    } else {
      loadBit |= 1;
      updateGraph();
    }
  }

  void onObjectRefresh() {
    loadBit |= 2;
    updateGraph();
  }

  void onEventRefresh() {
    loadBit |= 4;
    updateGraph();
  }

  void updateGraph() {
    if (loadBit == 7 && this.mounted) {
      setState(() {
        events = DataCarrier().getList<EventEntity>(groupId: widget.sessionId);
      });
    }
  }

  void fabOnPressed() {
    var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    var fun = (BuildContext context, int id) {
      return KeeperDrawerTile(
        child: ListTile(
          title: Text(nums[id].toString()),
        ),
      );
    };

    controller.openDrawer("Test", nums.length, fun);
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
    setState(() {
      loadBit = 0;
    });

    refresh();
  }

  @override
  void initState() {
    super.initState();
    DataCarrier().addListener<SessionEntity>(onSessionRefresh);
    DataCarrier().addListener<ObjectEntity>(onObjectRefresh);
    DataCarrier().addListener<EventEntity>(onEventRefresh);
    refresh();
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
      child: Scaffold(
        body: KeeperFloatingSearch(
          popup: KeeperPopup.settings(context),
          child: loadBit != 7
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
                    events: events,
                    startKey: startKey,
                  ),
                ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: events.isEmpty ? null : fabOnPressed,
          backgroundColor: events.isEmpty
              ? Color.alphaBlend(Theme.of(context).colorScheme.onPrimary.withOpacity(0.1),
                  Theme.of(context).colorScheme.primary)
              : Theme.of(context).colorScheme.primary,
          child: Icon(Icons.article_outlined),
        ),
      ),
    );
  }
}
