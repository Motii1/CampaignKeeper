import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/services/request_helper.dart';
import 'package:flutter/material.dart';

class Loading extends StatefulWidget {
  @override
  _LoadingState createState() => _LoadingState();
}

class _LoadingState extends State<Loading> {
  void autoLogin() async {
    await AppPrefs().refresh(context);
    // TODO: Use RequestHelper for a cached login attempt
    // If failed open login screen
    // Else open campaign screen

    //int loginRes = await RequestHelper().autoLogin();

    int test = await RequestHelper().testConnection();
    print(test);

    Navigator.pushReplacementNamed(context, "/settings");
  }

  @override
  void initState() {
    super.initState();
    autoLogin();
  }

  // TODO: replace img with spinner
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(

      ),
    );
  }
}
