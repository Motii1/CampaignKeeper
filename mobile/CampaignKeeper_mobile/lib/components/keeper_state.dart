import 'package:campaign_keeper_mobile/services/helpers/lifecycle_helper.dart';
import 'package:flutter/material.dart';

class KeeperState<T extends StatefulWidget> extends State<T> with WidgetsBindingObserver {
  void onResume() async {}

  void onEveryResume() async {}

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) async {
    if (state == AppLifecycleState.resumed) {
      if (ModalRoute.of(context)!.isCurrent && this.mounted) {
        await LifeCycleHelper().loginOnResume(context);
        onResume();
      }

      onEveryResume();
    }
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance!.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance!.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    throw UnimplementedError("You need to override build method");
  }
}