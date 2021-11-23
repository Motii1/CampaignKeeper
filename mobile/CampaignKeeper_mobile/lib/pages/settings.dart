import 'package:campaign_keeper_mobile/components/keeper_app_bar.dart';
import 'package:campaign_keeper_mobile/components/keeper_snack_bars.dart';
import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/services/lifecycle_helper.dart';
import 'package:campaign_keeper_mobile/services/request_helper.dart';
import 'package:flutter/material.dart';
import 'package:campaign_keeper_mobile/main.dart';
import 'package:flutter/services.dart';

class Settings extends StatefulWidget {
  @override
  _SettingsState createState() => _SettingsState();
}

class _SettingsState extends State<Settings> with WidgetsBindingObserver {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final debugUrlController = TextEditingController();
  bool isSystemThemeAvailable = false;
  bool isDebugMode = false;

  ThemeMode? _theme;

  String? validateDebugUrl(String? url) {
    if (url == null || url.isEmpty) {
      return 'Please enter url address with port';
    } else if (!url.contains("http")) {
      return "Url doesn't contain http";
    } else if (':'.allMatches(url).length != 2) {
      return "Url doesn't contain port";
    }

    return null;
  }

  void setDebugUrl() async {
    SystemChannels.textInput.invokeMethod('TextInput.hide');

    if (_formKey.currentState!.validate()) {
      AppPrefs().url = debugUrlController.text;
      ScaffoldMessenger.of(context).showSnackBar(KeeperSnackBars().debugUrl);
    } else if (debugUrlController.text.isEmpty) {
      AppPrefs().resetDebugUrl();
      debugUrlController.text = AppPrefs().url;
      ScaffoldMessenger.of(context).showSnackBar(KeeperSnackBars().debugUrl);
    }
  }

  void setTheme(ThemeMode? value) {
    _theme = value;
    if (_theme != null) {
      AppPrefs().setTheme(context, _theme!);
    }
  }

  void logout() async {
    await RequestHelper().logout(force: true);
    Navigator.pushNamedAndRemoveUntil(
        context, '/login', (Route<dynamic> route) => false);
  }

  void about() async {
    Navigator.pushNamed(
        context, '/settings/about',);
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) async {
    switch (state) {
      case AppLifecycleState.resumed:
        await LifeCycleHelper().loginOnResume(context);
        break;
      default:
        break;
    }
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance!.addObserver(this);

    AppPrefs().getSdkVersion().then((ver) {
      if (ver >= 29) {
        setState(() {
          isSystemThemeAvailable = true;
        });
      }
    });

    setState(() {
      isDebugMode = AppPrefs.debug;
      debugUrlController.text = AppPrefs().url;
    });

    _theme = MainApp.of(context)!.getTheme();
  }

  @override
  void dispose() {
    WidgetsBinding.instance!.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: KeeperAppBar(
        title: "Settings",
        backgroundColor: Theme.of(context).colorScheme.surface,
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
              Visibility(
                visible: isDebugMode,
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Padding(
                          padding: const EdgeInsets.fromLTRB(18, 15, 18, 8),
                          child: Text(
                            "DEBUG",
                            style: Theme.of(context).textTheme.subtitle2,
                          ),
                        ),
                        TextFormField(
                          //initialValue: AppPrefs().url,
                          decoration: InputDecoration(
                              helperText: " ", labelText: "Debug url"),
                          controller: debugUrlController,
                          validator: validateDebugUrl,
                        ),
                        ElevatedButton(
                          onPressed: setDebugUrl,
                          onLongPress: () {
                            Navigator.pushNamed(context, "/settings");
                          },
                          child: const Text('SET URL'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
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
