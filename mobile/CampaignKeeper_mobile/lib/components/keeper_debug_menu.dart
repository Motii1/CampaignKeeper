import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/components/keeper_snack_bars.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class KeeperDebugMenu extends StatefulWidget {
  const KeeperDebugMenu({Key? key, required this.isDebugMode}) : super(key: key);

  final bool isDebugMode;

  @override
  _KeeperDebugMenuState createState() => _KeeperDebugMenuState();
}

class _KeeperDebugMenuState extends State<KeeperDebugMenu> {
  final GlobalKey<FormState> _formDebug = GlobalKey<FormState>();
  final debugUrlController = TextEditingController();
  final debugTimeoutController = TextEditingController();
  final debugLoginTimeoutController = TextEditingController();

  String? validateDebugUrl(String? url) {
    if (url == null) {
      return 'Please enter url address with port';
    } else if (url.isEmpty) {
      return null;
    } else if (!url.contains("http")) {
      return "Url doesn't contain http";
    }

    return null;
  }

  String? validateTimeout(String? timeout) {
    if (timeout == null) {
      return "Timeout is empty";
    } else if (timeout.isEmpty) {
      return null;
    } else if (int.tryParse(timeout) == null) {
      return "Provided timeout is not a number";
    }

    return null;
  }

  void setDebug() async {
    SystemChannels.textInput.invokeMethod('TextInput.hide');

    if (_formDebug.currentState!.validate()) {
      if (debugUrlController.text.isEmpty) {
        AppPrefs().resetDebugUrl();
        debugUrlController.text = AppPrefs().url;
      }

      if (debugTimeoutController.text.isEmpty || debugLoginTimeoutController.text.isEmpty) {
        AppPrefs().resetDebugTimeout();
        debugTimeoutController.text = AppPrefs().timeout.toString();
        debugLoginTimeoutController.text = AppPrefs().loginTimeout.toString();
      }

      AppPrefs().url = debugUrlController.text;

      int? newTimeout = int.tryParse(debugTimeoutController.text);
      AppPrefs().timeout = newTimeout ?? AppPrefs().timeout;

      int? newLoginTimeout = int.tryParse(debugLoginTimeoutController.text);
      AppPrefs().loginTimeout = newLoginTimeout ?? AppPrefs().loginTimeout;

      ScaffoldMessenger.of(context).showSnackBar(KeeperSnackBars.debugUrl);
    }
  }

  @override
  void initState() {
    super.initState();
    debugUrlController.text = AppPrefs().url;
    debugTimeoutController.text = AppPrefs().timeout.toString();
    debugLoginTimeoutController.text = AppPrefs().loginTimeout.toString();
  }

  @override
  Widget build(BuildContext context) {
    return Visibility(
      visible: widget.isDebugMode,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 4),
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(10, 0, 18, 8),
                  child: Text(
                    "DEBUG",
                    style: Theme.of(context).textTheme.subtitle2,
                  ),
                ),
                Form(
                  key: _formDebug,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      TextFormField(
                        decoration: InputDecoration(helperText: " ", labelText: "Debug url"),
                        controller: debugUrlController,
                        validator: validateDebugUrl,
                      ),
                      TextFormField(
                        decoration: InputDecoration(helperText: " ", labelText: "Request timeout"),
                        controller: debugTimeoutController,
                        validator: validateTimeout,
                      ),
                      TextFormField(
                        decoration: InputDecoration(helperText: " ", labelText: "Login request timeout"),
                        controller: debugLoginTimeoutController,
                        validator: validateTimeout,
                      ),
                      ElevatedButton(
                        onPressed: setDebug,
                        child: const Text('SET DEBUG'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
