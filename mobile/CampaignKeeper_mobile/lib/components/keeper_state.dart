import 'package:campaign_keeper_mobile/components/keeper_snack_bars.dart';
import 'package:campaign_keeper_mobile/main.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:flutter/material.dart';

class KeeperState<T extends StatefulWidget> extends State<T> with WidgetsBindingObserver, RouteAware {
  void onResume() async {}

  void onEveryResume() async {}

  void showStatus() {
    bool isOnline = RequestHelper().isOnline;
    ScaffoldMessengerState scaffold = ScaffoldMessenger.of(context);
    if (ModalRoute.of(context)!.isCurrent && this.mounted && scaffold.mounted) {
      if (isOnline) {
        scaffold.showSnackBar(KeeperSnackBars.online);
      } else {
        scaffold.showSnackBar(KeeperSnackBars.offline);
      }
    }
  }

  void returnTo(String destination) {
    Navigator.popUntil(context, ModalRoute.withName(destination));
  }

  @mustCallSuper
  @override
  void didPopNext() {
    onResume();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) async {
    if (state == AppLifecycleState.resumed) {
      Future.delayed(Duration(milliseconds: 500), () {
        if (this.mounted) {
          if (ModalRoute.of(context)!.isCurrent) {
            onResume();
          }

          onEveryResume();
        }
      });
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    routeObserver.subscribe(this, ModalRoute.of(context) as PageRoute);
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance!.addObserver(this);
    RequestHelper().addListener(showStatus);
  }

  @override
  void dispose() {
    WidgetsBinding.instance!.removeObserver(this);
    RequestHelper().removeListener(showStatus);
    routeObserver.unsubscribe(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    throw UnimplementedError("You need to override build method");
  }
}
