import 'package:flutter/material.dart';
import 'package:campaign_keeper_mobile/pages/about.dart';
import 'package:campaign_keeper_mobile/pages/campaign.dart';
import 'package:campaign_keeper_mobile/pages/start.dart';
import 'package:campaign_keeper_mobile/pages/login.dart';
import 'package:campaign_keeper_mobile/themes/main_themes.dart';
import 'package:campaign_keeper_mobile/pages/loading.dart';
import 'package:campaign_keeper_mobile/pages/settings.dart';
import 'package:flutter/services.dart';

final RouteObserver<PageRoute> routeObserver = RouteObserver<PageRoute>();

void main() {
  runApp(MainApp());
}

class MainApp extends StatelessWidget {
  MainApp({Key? key}) : super(key: key);

  static ValueNotifier<ThemeMode> themeNotifier = ValueNotifier(ThemeMode.dark);
  final ThemeData _theme = MainThemes.light;
  final ThemeData _themeDark = MainThemes.dark;

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(statusBarColor: Colors.transparent));
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: themeNotifier,
      builder: (_, mode, __) {
        return GestureDetector(
          onTap: () {
            SystemChannels.textInput.invokeMethod('TextInput.hide');
          },
          child: MaterialApp(
            title: 'Campaign Keeper',
            theme: _theme,
            darkTheme: _themeDark,
            themeMode: mode,
            initialRoute: "/",
            routes: {
              "/": (context) => Loading(),
              "/settings": (context) => Settings(),
              "/settings/about": (context) => About(),
              "/login": (context) => Login(),
              "/start": (context) => Start(),
              "/start/campaign": (context) => Campaign(),
            },
            navigatorObservers: [routeObserver],
          ),
        );
      },
    );
  }
}
