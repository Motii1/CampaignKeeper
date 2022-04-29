import 'package:campaign_keeper_mobile/pages/account.dart';
import 'package:campaign_keeper_mobile/pages/session_map.dart';
import 'package:campaign_keeper_mobile/search_controllers/base_search_controller.dart';
import 'package:flutter/material.dart';
import 'package:campaign_keeper_mobile/pages/about.dart';
import 'package:campaign_keeper_mobile/pages/search.dart';
import 'package:campaign_keeper_mobile/pages/campaign.dart';
import 'package:campaign_keeper_mobile/pages/start.dart';
import 'package:campaign_keeper_mobile/pages/login.dart';
import 'package:campaign_keeper_mobile/themes/keeper_themes.dart';
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
  final ThemeData _theme = KeeperThemes.light;
  final ThemeData _themeDark = KeeperThemes.dark;

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
            onGenerateRoute: (RouteSettings settings) {
              var routes = <String, WidgetBuilder>{
                "/": (context) => Loading(),
                "/settings": (context) => Settings(),
                "/settings/account": (context) => Account(),
                "/settings/about": (context) => About(),
                "/search": (context) => Search(searchController: settings.arguments as BaseSearchController),
                "/login": (context) => Login(),
                "/start": (context) => Start(),
                "/start/campaign": (context) => Campaign(campaignID: settings.arguments as int),
                "/start/campaign/session_map": (context) => SessionMap(sessionID: settings.arguments as int),
              };
              WidgetBuilder builder = routes[settings.name]!;
              return MaterialPageRoute(builder: (ctx) => builder(ctx));
            },
            navigatorObservers: [routeObserver],
          ),
        );
      },
    );
  }
}
