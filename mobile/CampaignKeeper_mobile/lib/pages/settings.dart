import 'package:campaign_keeper_mobile/components/app_bar/keeper_app_bar.dart';
import 'package:campaign_keeper_mobile/components/keeper_debug_menu.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/services/helpers/login_helper.dart';
import 'package:flutter/material.dart';

class Settings extends StatefulWidget {
  @override
  _SettingsState createState() => _SettingsState();
}

class _SettingsState extends KeeperState<Settings> {
  bool isSystemThemeAvailable = false;
  bool isDebugMode = false;

  ThemeMode? _theme;

  void setTheme(ThemeMode? value) {
    _theme = value;
    if (_theme != null) {
      AppPrefs().setTheme(context, _theme!);
    }
  }

  void logout() async {
    LoginHelper().logout(force: true);
    Navigator.pushNamedAndRemoveUntil(context, '/login', (Route<dynamic> route) => false);
  }

  void about() async {
    Navigator.pushNamed(
      context,
      '/settings/about',
    );
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

    setState(() {
      isDebugMode = AppPrefs().debug;
    });

    _theme = AppPrefs().getTheme(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: KeeperAppBar(
        title: "Settings",
        sliver: SliverList(
          delegate: SliverChildListDelegate(
            [
              Padding(
                padding: const EdgeInsets.fromLTRB(18, 10, 18, 0),
                child: Text(
                  "USER",
                  style: Theme.of(context).textTheme.subtitle2,
                ),
              ),
              ListTile(
                title: Text(
                  "Log out",
                ),
                onTap: logout,
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(18, 15, 18, 0),
                child: Text(
                  "APP THEME",
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
              KeeperDebugMenu(isDebugMode: isDebugMode),
              Padding(
                padding: const EdgeInsets.fromLTRB(18, 15, 18, 0),
                child: Text(
                  "APP",
                  style: Theme.of(context).textTheme.subtitle2,
                ),
              ),
              ListTile(
                title: Text(
                  "About",
                ),
                onTap: about,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
