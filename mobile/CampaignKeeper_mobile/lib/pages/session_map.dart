import 'package:campaign_keeper_mobile/components/app_bar/keeper_floating_search.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/entities/session_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';

class SessionMap extends StatefulWidget {
  const SessionMap({Key? key, required this.sessionID}) : super(key: key);
  final int sessionID;

  @override
  State<SessionMap> createState() => _SessionMapState();
}

class _SessionMapState extends KeeperState<SessionMap> {
  late SessionEntity? session = DataCarrier().get(entId: widget.sessionID);

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
            : Container(),
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
