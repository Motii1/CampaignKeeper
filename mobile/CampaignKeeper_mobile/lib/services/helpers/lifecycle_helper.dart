import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/components/keeper_snack_bars.dart';
import 'package:flutter/material.dart';

class LifeCycleHelper {
  static final LifeCycleHelper _life = LifeCycleHelper._internal();

  factory LifeCycleHelper() {
    return _life;
  }

  LifeCycleHelper._internal();

  Future<void> testConnectionOnResume(BuildContext context) async {
    var status = await RequestHelper().testConnection();

    switch (status) {
      case ServerStatus.Available:
        break;
      default:
        ScaffoldMessenger.of(context).showSnackBar(KeeperSnackBars().offline);
        break;
    }
  }

  Future<void> loginOnResume(BuildContext context) async {
    var status = await RequestHelper().autoLogin();

    switch (status) {
      case LoginStatus.ServerError:
        ScaffoldMessenger.of(context).showSnackBar(KeeperSnackBars().offline);
        break;
      case LoginStatus.IncorrectData:
        RequestHelper().logout(force: true);
        Navigator.pushNamedAndRemoveUntil(
            context, '/login', (Route<dynamic> route) => false);
        break;
      default:
        break;
    }
  }

  Future<void> logoutOnPaused() async {
    await RequestHelper().logout();
  }
}
