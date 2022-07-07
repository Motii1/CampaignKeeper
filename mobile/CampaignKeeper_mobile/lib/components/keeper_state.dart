import 'package:campaign_keeper_mobile/main.dart';
import 'package:flutter/material.dart';

// An extension of a classic widget state.
// Used to reduce code and automate apps
// life cycle at pages widgets.
class KeeperState<T extends StatefulWidget> extends State<T> with WidgetsBindingObserver, RouteAware {
  // Function run on every resume when this widget is visible.
  void onResume() async {}

  // Function run on every resume when this widget is mounted,
  // but not necessarily visible.
  void onEveryResume() async {}

  // Function run on the return to this widget.
  void onReturn() async {}

  // Allows to return to the specific page in a stack.
  // Will work only if current widget is a currently
  // visible one.
  void returnTo(String destination) {
    if (this.mounted && ModalRoute.of(context)!.isCurrent) {
      Navigator.popUntil(context, ModalRoute.withName(destination));
    }
  }

  @mustCallSuper
  @override
  void didPopNext() {
    onReturn();
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
  }

  @override
  void dispose() {
    WidgetsBinding.instance!.removeObserver(this);
    routeObserver.unsubscribe(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    throw UnimplementedError("You need to override build method");
  }
}
