import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:flutter/material.dart';
import '../main.dart';

class Settings extends StatefulWidget {
  @override
  _SettingsState createState() => _SettingsState();
}

class _SettingsState extends State<Settings> {
  bool isSystemThemeAvailable = true;

  ThemeMode? _theme;

  void setTheme(ThemeMode? value) {
    _theme = value;
    if (_theme != null) {
      AppPrefs().setTheme(context, _theme!);
    }
  }

  @override
  void initState() {
    super.initState();

    AppPrefs().getSdkVersion().then((ver) {
      if (ver >= 29) {
        setState(() {
          isSystemThemeAvailable = true;
        });
      }
    });

    _theme = MainApp.of(context)!.getTheme();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).backgroundColor,
      appBar: AppBar(
        title: Text("Settings"),
        backgroundColor: Theme.of(context).backgroundColor,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18.0),
              child: Text(
                "App theme",
                style: Theme.of(context).textTheme.subtitle2,
              ),
            ),
            RadioListTile(
              title: Text("Light"),
              value: ThemeMode.light,
              groupValue: _theme,
              onChanged: setTheme,
            ),
            RadioListTile(
              title: Text("Dark"),
              value: ThemeMode.dark,
              groupValue: _theme,
              onChanged: setTheme,
            ),
            Visibility(
              visible: isSystemThemeAvailable,
              child: RadioListTile(
                title: Text("System"),
                value: ThemeMode.system,
                groupValue: _theme,
                onChanged: setTheme,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
