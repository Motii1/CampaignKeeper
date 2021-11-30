import 'package:campaign_keeper_mobile/components/keeper_logo_cart.dart';
import 'package:campaign_keeper_mobile/components/keeper_snack_bars.dart';
import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/services/request_helper.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class Login extends StatelessWidget {
  const Login({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(0),
        child: AppBar(),
      ),
      body: Center(
        child: SingleChildScrollView(
          child: LoginCard(),
        ),
      ),
    );
  }
}

class LoginCard extends StatefulWidget {
  const LoginCard({Key? key}) : super(key: key);

  @override
  _LoginCardState createState() => _LoginCardState();
}

class _LoginCardState extends State<LoginCard> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final loginController = TextEditingController();
  final passwordController = TextEditingController();

  bool isLoginCorrect = true;
  bool isPasswordCorrect = true;

  String? validateLogin(String? login) {
    if (!isLoginCorrect) {
      isLoginCorrect = true;
      return " ";
    }

    if (login == null || login.isEmpty) {
      return 'Please enter login or email address';
    } else if (login.length < 5) {
      return "Login is too short";
    } else if (login.length > 256) {
      return "Login is too long";
    }

    return null;
  }

  String? validatePassword(String? password) {
    if (!isPasswordCorrect) {
      isPasswordCorrect = true;
      return " ";
    }

    if (password == null || password.isEmpty) {
      return 'Please enter password';
    } else if (password.length < 7) {
      return "Password is too short";
    } else if (password.length > 256) {
      return "Password is too long";
    }

    return null;
  }

  void loginAttempt() async {
    SystemChannels.textInput.invokeMethod('TextInput.hide');

    if (_formKey.currentState!.validate()) {
      LoginStatus status = await RequestHelper()
          .login(loginController.text, passwordController.text);

      switch (status) {
        case LoginStatus.Success:
          // TODO: replace settings with campaign screen
          Navigator.pushReplacementNamed(context, "/settings");
          break;
        case LoginStatus.IncorrectData:
          isLoginCorrect = isPasswordCorrect = false;

          _formKey.currentState!.validate();
          ScaffoldMessenger.of(context)
              .showSnackBar(KeeperSnackBars().incorrect);
          break;
        case LoginStatus.ServerError:
          ScaffoldMessenger.of(context).showSnackBar(KeeperSnackBars().offline);
          break;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return KeeperLogoCard(
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            TextFormField(
              autocorrect: false,
              decoration:
                  InputDecoration(helperText: " ", labelText: "Login or email"),
              controller: loginController,
              validator: validateLogin,
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 6),
              child: TextFormField(
                obscureText: true,
                enableSuggestions: false,
                autocorrect: false,
                decoration:
                    InputDecoration(helperText: " ", labelText: "Password"),
                controller: passwordController,
                validator: validatePassword,
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(3, 0, 3, 7),
              child: Text(
                "Isn’t your drunk face familiar?\nCome here and",
                style: Theme.of(context).textTheme.bodyText1,
              ),
            ),
            ElevatedButton(
              onPressed: loginAttempt,
              onLongPress: () {
                if (AppPrefs.debug) {
                  Navigator.pushNamed(context, "/settings");
                }
              },
              child: const Text('LOGIN'),
            ),
          ],
        ),
      ),
    );
  }
}