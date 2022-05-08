import 'package:campaign_keeper_mobile/components/app_bar/keeper_app_bar.dart';
import 'package:campaign_keeper_mobile/components/keeper_debug_menu.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/components/list/keeper_list_header.dart';
import 'package:campaign_keeper_mobile/components/list/keeper_list_tile.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/login_helper.dart';
import 'package:flutter/material.dart';

// Page representing settings.
// Allows to log out, enter account or about subpage
// and for developers to change url and timeout options.
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

  void onTapLogout() async {
    LoginHelper().logout();
    Navigator.pushNamedAndRemoveUntil(context, '/login', (Route<dynamic> route) => false);
  }

  void onTapAccount() async {
    if (DataCarrier().get<UserDataEntity>() != null) {
      Navigator.pushNamed(
        context,
        '/settings/account',
      );
    }
  }

  void onTapAbout() async {
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
              KeeperListHeader(title: "User"),
              KeeperListTile(
                title: "Account",
                onTap: onTapAccount,
              ),
              KeeperListTile(
                title: "Log out",
                onTap: onTapLogout,
              ),
              KeeperListHeader(title: "Theme"),
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
              KeeperListHeader(title: "App"),
              KeeperListTile(
                title: "About",
                onTap: onTapAbout,
              ),
              KeeperDebugMenu(isDebugMode: isDebugMode),
            ],
          ),
        ),
      ),
    );
  }
}
