import 'dart:convert';
import 'dart:core';
import 'dart:io' show Platform;
import 'package:campaign_keeper_mobile/services/cache_util.dart';
import 'package:device_info/device_info.dart';
import 'package:flutter/material.dart';
import 'package:campaign_keeper_mobile/main.dart';

class AppPrefs {
  static final AppPrefs _app = AppPrefs._internal();
  static const String milestone = "Eden Prime";
  static const String _key = "app_prefs";
  static const String _url = "http://10.0.2.2:4000";
  static const bool debug = true;

  String _debugUrl = _url;
  ThemeMode _theme = ThemeMode.dark;

  String get url {
    if (debug) {
      return _debugUrl;
    } else {
      return _url;
    }
  }

  set url(String value) {
    _debugUrl = value;
    _cachePrefs();
  }

  factory AppPrefs() => _app;

  AppPrefs._internal();

  Future<void> refresh(BuildContext context) async {
    var val = await CacheUtil().get(_key);

    if (val != null) {
      Map decodedPrefs = {};

      try {
        decodedPrefs = json.decode(val);
      } catch(e) {
        CacheUtil().delete(key: _key);
      }

      _debugUrl = decodedPrefs["debugUrl"] == null ? "" : decodedPrefs["debugUrl"];
      _theme = await _stringToTheme(decodedPrefs["theme"]);
    } else {
      _theme = await _getDefaultTheme();
    }

    setTheme(context, _theme);
  }

  void setTheme(BuildContext context, ThemeMode theme) {
    _theme = theme;

    if (theme != MainApp.of(context)!.getTheme()) {
      MainApp.of(context)!.changeTheme(theme);
    }

    _cachePrefs();
  }

  ThemeMode getTheme(BuildContext context) => _theme;

  Future<int> getSdkVersion() async {
    final DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();

    if (Platform.isAndroid) {
      final AndroidDeviceInfo androidInfo = await deviceInfo.androidInfo;
      return androidInfo.version.sdkInt;
    }

    return 0;
  }

  void resetDebugUrl() {
    _debugUrl = _url;
    _cachePrefs();
  }

  Future<ThemeMode> _stringToTheme(String? theme) async {
    if (theme == null) {
      return await _getDefaultTheme();
    } else {
      switch (theme) {
        case "light":
          return ThemeMode.light;
        case "system":
          return ThemeMode.system;
        default:
          return ThemeMode.dark;
      }
    }
  }

  String _themeToString(ThemeMode? theme) {
    switch (theme) {
      case ThemeMode.light:
        return "light";
      case ThemeMode.system:
        return "system";
      default:
        return "dark";
    }
  }

  Future<ThemeMode> _getDefaultTheme() async {
    var sdk = await getSdkVersion();

    if (sdk >= 29) {
      return ThemeMode.system;
    }

    return ThemeMode.dark;
  }

  void _cachePrefs() {
    Map prefs = {"theme": _themeToString(_theme), "debugUrl": _debugUrl};
    CacheUtil().add(_key, json.encode(prefs));
  }
}
