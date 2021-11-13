import 'dart:convert';
import 'dart:core' as core;
import 'dart:io';
import 'package:campaign_keeper_mobile/services/cache_util.dart';
import 'package:device_info/device_info.dart';
import 'package:flutter/material.dart';
import 'package:campaign_keeper_mobile/main.dart';
import 'package:flutter/foundation.dart';

class AppPrefs {
  static final AppPrefs _app = AppPrefs._internal();
  static const core.String _key = "app_prefs";
  static const core.String _url = "http://10.0.2.2:4000";

  core.String _debugUrl = _url;
  ThemeMode _theme = ThemeMode.dark;

  core.String get url {
    if (kReleaseMode) {
      return _url;
    } else {
      return _debugUrl;
    }
  }

  set url(core.String value) {
    _debugUrl = value;
    _cachePrefs();
  }

  factory AppPrefs() => _app;

  AppPrefs._internal();

  core.Future<void> refresh(BuildContext context) async {
    var val = await CacheUtil().get(_key);

    if (val != null) {
      core.Map decodedPrefs = {};

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

  core.Future<core.int> getSdkVersion() async {
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

  core.Future<ThemeMode> _stringToTheme(core.String? theme) async {
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

  core.Future<ThemeMode> _getDefaultTheme() async {
    var sdk = await getSdkVersion();

    if (sdk >= 29) {
      return ThemeMode.system;
    }

    return ThemeMode.dark;
  }

  void _cachePrefs() {
    core.Map prefs = {"theme": _themeToString(_theme), "debugUrl": _debugUrl};
    CacheUtil().add(_key, json.encode(prefs));
  }
}
