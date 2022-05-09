import 'package:campaign_keeper_mobile/components/app_bar/keeper_floating_search.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/components/keeper_interactive_viewer.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/entities/session_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/facades/fake_event_facade.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:graphview/GraphView.dart';

// Page displaying map of events in the current session.
// Allows to show details of a particular event or
// use a FAB to show the first, root one.
class SessionMap extends StatefulWidget {
  const SessionMap({Key? key, required this.sessionID}) : super(key: key);
  final int sessionID;

  @override
  State<SessionMap> createState() => _SessionMapState();
}

class _SessionMapState extends KeeperState<SessionMap> {
  late SessionEntity? session = DataCarrier().get(entId: widget.sessionID);
  var eventFacade = FakeEventFacade();

  Future<void> onRefresh() async {
    await DataCarrier().refresh<UserDataEntity>();
    await DataCarrier().refresh<SessionEntity>(groupId: session?.campaignId ?? -1);
  }

  Future<void> onSessionRefresh() async {
    SessionEntity? entity = DataCarrier().get(entId: widget.sessionID);
    if (entity == null) {
      returnTo('/start');
    } else {
      setState(() {
        session = entity;
      });
    }
  }

  @override
  void onEveryResume() {
    DataCarrier().refresh<SessionEntity>(groupId: session?.campaignId ?? -1);
  }

  @override
  void onReturn() {
    onSessionRefresh();
  }

  @override
  void initState() {
    super.initState();
    DataCarrier().addListener<SessionEntity>(onSessionRefresh);
    DataCarrier().refresh<SessionEntity>(groupId: session?.campaignId ?? -1);
  }

  @override
  void dispose() {
    DataCarrier().removeListener<SessionEntity>(onSessionRefresh);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: KeeperFloatingSearch(
        popup: KeeperPopup.settings(context),
        child: session == null
            ? Center(
                child: SpinKitRing(
                  color: Theme.of(context).colorScheme.onBackground,
                  size: 40.0,
                  lineWidth: 5.0,
                ),
              )
            : KeeperInteractiveViewer(
                child: GraphView(
                  graph: eventFacade.getGraph(),
                  algorithm: KeeperSugiyamaAlgorithm(eventFacade.getBuilder()),
                  paint: Paint()
                    ..color = Theme.of(context).colorScheme.onBackground
                    ..strokeWidth = 2.5
                    ..style = PaintingStyle.stroke,
                  builder: (Node node) {
                    // I can decide what widget should be shown here based on the id
                    var id = node.key?.value as int;
                    return eventFacade.getNodeWidget(context, id);
                  },
                ),
              ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          print("Move to the first event");
        },
        backgroundColor: Theme.of(context).colorScheme.primary,
        child: Icon(Icons.article_outlined),
      ),
    );
  }
}
