import 'package:campaign_keeper_mobile/components/keeper_fadein.dart';
import 'package:flutter/material.dart';

class KeeperSnackBars {
  static SnackBar snack(String message) {
    return SnackBar(
      content: KeeperFadeIn(
        duration: Duration(milliseconds: 100),
        child: Text(message),
      ),
      dismissDirection: DismissDirection.horizontal,
    );
  }

  static SnackBar offline = snack("Network is under geth attack, going offline");
  static SnackBar online = snack("Power core inserted, network restored");
  static SnackBar incorrect = snack("Aye, that data doesn't match, does it?");
  static SnackBar debugUrl = snack("Set debug url");
  static SnackBar genericError = snack("I've bad feelings about that. Something is wrong.");
}
