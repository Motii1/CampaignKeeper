import 'package:campaign_keeper_mobile/components/keeper_snack_bars.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:flutter/material.dart';

// Scaffold wraper with added functionality of
// displaying status connectivity changes.
class KeeperScaffold extends StatefulWidget {
  final PreferredSizeWidget? appBar;
  final Widget? body;
  final Widget? bottomNavigationBar;
  final Widget? floatingActionButton;

  const KeeperScaffold(
      {Key? key, this.appBar, this.body, this.bottomNavigationBar, this.floatingActionButton})
      : super(key: key);

  @override
  State<KeeperScaffold> createState() => _KeeperScaffoldState();
}

class _KeeperScaffoldState extends State<KeeperScaffold> {
  // Shows a snackbar with a connection status info
  // when connection status changes.
  void statusListener() async {
    bool isOnline = RequestHelper().isOnline;
    bool isCurrent = ModalRoute.of(context)?.isCurrent == true;
    ScaffoldMessengerState? scaffold = ScaffoldMessenger.maybeOf(context);
    if (isCurrent && scaffold != null && scaffold.mounted) {
      if (isOnline) {
        scaffold.showSnackBar(KeeperSnackBars.online);
      } else {
        scaffold.showSnackBar(KeeperSnackBars.offline);
      }
    }
  }

  @override
  void initState() {
    super.initState();
    RequestHelper().addListener(statusListener);
  }

  @override
  void dispose() {
    RequestHelper().removeListener(statusListener);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: widget.appBar,
      body: widget.body,
      bottomNavigationBar: widget.bottomNavigationBar,
      floatingActionButton: widget.floatingActionButton,
    );
  }
}
