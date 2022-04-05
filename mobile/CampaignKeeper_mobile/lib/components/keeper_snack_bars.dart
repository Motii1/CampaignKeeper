import 'package:campaign_keeper_mobile/components/keeper_fadein.dart';
import 'package:flutter/material.dart';

class KeeperSnackBars {
  static SnackBar _default(String message) {
    return SnackBar(
      content: KeeperFadeIn(
        duration: Duration(milliseconds: 100),
        child: Text(message),
      ),
      dismissDirection: DismissDirection.horizontal,
    );
  }

  static SnackBar offline = _default("Network is under geth attack, going offline");
  static SnackBar online = _default("Power core inserted, network restored");
  static SnackBar incorrect = _default("Ay, that data doesn't match, does it?");
  static SnackBar debugUrl = _default("Set debug url");
}
