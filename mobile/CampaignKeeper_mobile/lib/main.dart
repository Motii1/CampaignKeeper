import 'package:campaign_keeper_mobile/pages/about.dart';
import 'package:campaign_keeper_mobile/pages/campaigns.dart';
import 'package:campaign_keeper_mobile/pages/login.dart';
import 'package:campaign_keeper_mobile/themes/main_themes.dart';
import 'package:flutter/material.dart';
import 'package:campaign_keeper_mobile/pages/loading.dart';
import 'package:campaign_keeper_mobile/pages/settings.dart';
import 'package:flutter/services.dart';

void main() {
  runApp(MainApp());
}

class MainApp extends StatefulWidget {
  @override
  _MainAppState createState() => _MainAppState();

  static _MainAppState? of(BuildContext context) =>
      context.findAncestorStateOfType<_MainAppState>();
}

class _MainAppState extends State<MainApp>{
  ThemeMode _themeMode = ThemeMode.dark;
  ThemeData _theme = MainThemes.light;
  ThemeData _themeDark = MainThemes.dark;

  void changeTheme(ThemeMode themeMode) {
    setState(() {
      _themeMode = themeMode;
    });
  }

  ThemeMode getTheme() => _themeMode;

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(
        SystemUiOverlayStyle(statusBarColor: Colors.transparent));
    return GestureDetector(
      onTap: () {
        SystemChannels.textInput.invokeMethod('TextInput.hide');
      },
      child: MaterialApp(
        title: 'Campaign Keeper',
        theme: _theme,
        darkTheme: _themeDark,
        themeMode: _themeMode,
        initialRoute: "/loading",
        routes: {
          "/loading": (context) => Loading(),
          "/settings": (context) => Settings(),
          "/settings/about": (context) => About(),
          "/login": (context) => Login(),
          "/campaigns": (context) => Campaigns(),
        },
      ),
    );
  }
}
