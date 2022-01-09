import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/services/helpers/login_helper.dart';
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

    if (status != ResponseStatus.Success) {
      ScaffoldMessenger.of(context).showSnackBar(KeeperSnackBars().offline);
    }
  }

  Future<void> loginOnResume(BuildContext context) async {
    var status = await LoginHelper().autoLogin();

    switch (status) {
      case ResponseStatus.Error:
        ScaffoldMessenger.of(context).showSnackBar(KeeperSnackBars().offline);
        break;
      case ResponseStatus.IncorrectData:
        LoginHelper().logout(force: true);
        Navigator.pushNamedAndRemoveUntil(
            context, '/login', (Route<dynamic> route) => false);
        break;
      default:
        break;
    }
  }
}
