import 'package:campaign_keeper_mobile/pages/account.dart';
import 'package:campaign_keeper_mobile/pages/event_explorer.dart';
import 'package:campaign_keeper_mobile/pages/object_explorer.dart';
import 'package:campaign_keeper_mobile/pages/schema_objects.dart';
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

// Classic main method.
void main() {
  runApp(MainApp());
}

// Main widget that's a base for a whole app.
// Keeps current theme, sets statusbar style
// and adds functionality to hide a keyboard
// when tapped outside of a input field.
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
            initialRoute: '/',
            routes: {
              '/': (context) => Loading(),
              '/settings': (context) => Settings(),
              '/settings/account': (context) => Account(),
              '/settings/about': (context) => About(),
              '/login': (context) => Login(),
              '/start': (context) => Start(),
            },
            onGenerateRoute: (RouteSettings settings) {
              var routes = <String, WidgetBuilder>{
                '/search': (context) => Search(searchController: settings.arguments as BaseSearchController),
                '/start/campaign': (context) => Campaign(campaignId: settings.arguments as int),
                '/start/campaign/session_map': (context) => SessionMap(sessionId: settings.arguments as int),
                '/start/campaign/schema_objects': (context) =>
                    SchemaObjects(schemaId: settings.arguments as int),
                '/start/campaign/schema_objects/object_explorer': (context) =>
                    ObjectExplorer(objectId: settings.arguments as int),
                '/start/campaign/session_map/event_explorer': (context) =>
                    EventExplorer(eventId: settings.arguments as int),
              };
              WidgetBuilder builder = routes[settings.name]!;
              return MaterialPageRoute(builder: (ctx) => builder(ctx));
            },
            navigatorObservers: [routeObserver],
            builder: (context, child) {
              return ScrollConfiguration(
                behavior: MaterialScrollBehavior(
                  androidOverscrollIndicator: AndroidOverscrollIndicator.stretch,
                ),
                child: child!,
              );
            },
          ),
        );
      },
    );
  }
}
