import 'dart:convert';
import 'dart:core';
import 'dart:io' show Platform;
import 'package:campaign_keeper_mobile/services/helpers/cache_helper.dart';
import 'package:device_info/device_info.dart';
import 'package:flutter/material.dart';
import 'package:campaign_keeper_mobile/main.dart';

// Used to store any information that are app specific
// and not related to the account and the service.
class AppPrefs {
  static final AppPrefs _app = AppPrefs._internal();
  final String milestone = "Terra Nova";
  final String _key = "app_prefs";
  final String _url = "https://campaignkeeper.herokuapp.com";
  final bool debug = false;
  final int _timeout = 60;
  final int _loginTimeout = 120;

  String _debugUrl = "";
  int _debugTimeout = 0;
  int _debugLoginTimeout = 0;
  ThemeMode _theme = ThemeMode.dark;

  // Getter for a server api url.
  String get url {
    if (debug) {
      return _debugUrl;
    } else {
      return _url;
    }
  }

  // Setter for a server api url.
  set url(String value) {
    _debugUrl = value;
    _cachePrefs();
  }

  // Getter for a http request timeout.
  int get timeout {
    if (debug) {
      return _debugTimeout;
    } else {
      return _timeout;
    }
  }

  // Setter for a http request timeout.
  set timeout(int value) {
    _debugTimeout = value;
    _cachePrefs();
  }

  // Getter for a http login request timeout.
  int get loginTimeout {
    if (debug) {
      return _debugLoginTimeout;
    } else {
      return _loginTimeout;
    }
  }

  // Setter for a http login timeout.
  set loginTimeout(int value) {
    _debugLoginTimeout = value;
    _cachePrefs();
  }

  factory AppPrefs() => _app;

  AppPrefs._internal() {
    _debugUrl = "http://10.0.2.2:4000";
    _debugTimeout = 5;
    _debugLoginTimeout = 2;
  }

  // Loads cached user settings and applies a theme.
  Future<void> refresh(BuildContext context) async {
    var val = await CacheHelper().get(_key);

    if (val != null) {
      Map decodedPrefs = {};

      try {
        decodedPrefs = json.decode(val);
      } catch (e) {
        CacheHelper().delete(key: _key);
      }

      _debugUrl = decodedPrefs["debugUrl"] ?? _url;
      _debugTimeout = decodedPrefs["debugTimeout"] ?? _timeout;
      _debugLoginTimeout = decodedPrefs["debugLoginTimeout"] ?? _loginTimeout;
      _theme = await _stringToTheme(decodedPrefs["theme"]);
    } else {
      _theme = await _getDefaultTheme();
    }

    setTheme(context, _theme, true);
  }

  // Applies a theme to the app.
  void setTheme(BuildContext context, ThemeMode theme, [bool force = false]) {
    if (theme != _theme || force) {
      _theme = theme;
      MainApp.themeNotifier.value = theme;
    }

    _cachePrefs();
  }

  // Gets current theme.
  ThemeMode getTheme(BuildContext context) => _theme;

  // Gets android devices sdk version.
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

  void resetDebugTimeout() {
    _debugTimeout = _timeout;
    _debugLoginTimeout = _loginTimeout;
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
    Map prefs = {
      "theme": _themeToString(_theme),
      "debugUrl": _debugUrl,
      "debugTimeout": _debugTimeout,
      "debugLoginTimeout": _debugLoginTimeout,
    };
    CacheHelper().add(_key, json.encode(prefs));
  }
}
