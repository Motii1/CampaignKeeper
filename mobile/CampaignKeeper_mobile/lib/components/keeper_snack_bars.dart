import 'package:flutter/material.dart';

class KeeperSnackBars {
  static const SnackBar offline = SnackBar(
    content: Text("Network is under geth attack, going offline"),
    dismissDirection: DismissDirection.horizontal,
  );
  static const SnackBar online = SnackBar(
    content: Text("Power core inserted, network restored"),
    dismissDirection: DismissDirection.horizontal,
  );
  static const SnackBar incorrect = SnackBar(
    content: Text("Ay, that data doesn't match, does it?"),
    dismissDirection: DismissDirection.horizontal,
  );
  static const SnackBar debugUrl = SnackBar(
    content: Text("Set debug url"),
    dismissDirection: DismissDirection.horizontal,
  );

  static const SnackBar exit = SnackBar(
    content: Text(
      "Press back again to exit",
      textAlign: TextAlign.center,
      overflow: TextOverflow.ellipsis,
      textScaleFactor: 1.0,
      style: TextStyle(fontSize: 15),
    ),
    duration: Duration(seconds: 1, milliseconds: 500),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(30)),
    ),
    width: 220,
  );
}
