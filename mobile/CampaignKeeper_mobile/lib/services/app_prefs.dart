import 'dart:core' as core;
import 'dart:io';
import 'package:device_info/device_info.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:campaign_keeper_mobile/main.dart';

class AppPrefs {
  static final AppPrefs _app = AppPrefs._internal();
  static const core.String _key = "app_prefs";

  ThemeMode _theme = ThemeMode.dark;

  factory AppPrefs() => _app;

  AppPrefs._internal();

  core.Future<void> refresh(BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    core.int sdkVer = await getSdkVersion();
    core.String? val = prefs.getString(_key);

    if (val != null) {
      _theme = _stringToTheme(val);
    } else if (sdkVer >= 29) {
      _theme = ThemeMode.system;
    }

    setTheme(context, _theme);
  }

  void setTheme(BuildContext context, ThemeMode theme) {
    _theme = theme;

    if (theme != MainApp.of(context)!.getTheme()) {
      MainApp.of(context)!.changeTheme(theme);
    }

    SharedPreferences.getInstance()
        .then((prefs) => prefs.setString(_key, _themeToString(theme)));
  }

  ThemeMode getTheme(BuildContext context) => _theme;

  core.Future<core.int> getSdkVersion() async {
    final DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();

    if (Platform.isAndroid) {
      final AndroidDeviceInfo androidInfo = await deviceInfo.androidInfo;
      return androidInfo.version.sdkInt;
    }

    return 0;
  }

  ThemeMode _stringToTheme(core.String theme) {
    switch (theme) {
      case "light":
        return ThemeMode.light;
      case "system":
        return ThemeMode.system;
      default:
        return ThemeMode.dark;
    }
  }

  core.String _themeToString(ThemeMode? theme) {
    switch (theme) {
      case ThemeMode.light:
        return "light";
      case ThemeMode.system:
        return "system";
      default:
        return "dark";
    }
  }
}
