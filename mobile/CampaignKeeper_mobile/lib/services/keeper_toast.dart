import 'package:flutter/services.dart';

// A bridge between Flutter code and Android native implementation for toast notification
class KeeperToast {
  static const platform = MethodChannel('com.campaignkeeperteam.app.campaign_keeper_mobile/toast');

  // Calls android native code to display a toast notification
  static Future<void> show(String text) async {
    try {
      Map arguments = {'text': text};
      platform.invokeMethod(
        'keeperShowToast',
        arguments,
      );
    } on PlatformException catch (_) {
      print("Toasts can be made only on Android");
    }
  }
}
