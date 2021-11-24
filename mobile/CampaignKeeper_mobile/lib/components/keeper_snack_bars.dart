import 'package:flutter/material.dart';

class KeeperSnackBars {
  static final KeeperSnackBars _bars = KeeperSnackBars._internal();

  static const SnackBar _offline = SnackBar(
    content: Text("Network is under geth attack, going offline."),
    dismissDirection: DismissDirection.horizontal,
  );
  static const SnackBar _incorrect = SnackBar(
    content: Text("Ay, that data doesn't match, does it?"),
    dismissDirection: DismissDirection.horizontal,
  );
  static const SnackBar _debugUrl = SnackBar(
    content: Text("Set debug url."),
    dismissDirection: DismissDirection.horizontal,
  );


  SnackBar get offline => _offline;
  SnackBar get incorrect => _incorrect;
  SnackBar get debugUrl => _debugUrl;

  factory KeeperSnackBars() {
    return _bars;
  }

  KeeperSnackBars._internal();
}