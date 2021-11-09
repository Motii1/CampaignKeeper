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

class _MainAppState extends State<MainApp> with WidgetsBindingObserver {
  ThemeMode _themeMode = ThemeMode.dark;
  ThemeData _theme = MainThemes.light;
  ThemeData _themeDark = MainThemes.dark;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance!.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance!.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    switch(state) {
      case AppLifecycleState.paused:
        // TODO: cache entries here
        break;
      case AppLifecycleState.resumed:
        // try autologin
        break;
      default:
        break;
    }
  }

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
    return MaterialApp(
      title: 'Campaign Keeper',
      theme: _theme,
      darkTheme: _themeDark,
      themeMode: _themeMode,
      initialRoute: "/loading",
      routes: {
        "/loading": (context) => Loading(),
        "/test": (context) => MyHomePage(title: "Demo"),
        "/settings": (context) => Settings(),
      },
    );
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              "Choose theme",
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                    onPressed: () =>
                        MainApp.of(context)!.changeTheme(ThemeMode.light),
                    child: Text("Light")),
                ElevatedButton(
                    onPressed: () =>
                        MainApp.of(context)!.changeTheme(ThemeMode.dark),
                    child: Text("Dark")),
                ElevatedButton(
                    onPressed: () =>
                        MainApp.of(context)!.changeTheme(ThemeMode.system),
                    child: Text("System")),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
