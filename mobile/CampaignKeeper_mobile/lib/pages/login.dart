import 'package:campaign_keeper_mobile/services/request_helper.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';

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
  @override
  Widget build(BuildContext context) {
    final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
    final loginController = TextEditingController();
    final passwordController = TextEditingController();

    bool isLoginCorrect = true;
    bool isPasswordCorrect = true;

    // TODO: Create login and password validators
    String? validateLogin(String? login) {
      if (!isLoginCorrect) {
        isLoginCorrect = true;
        return " ";
      }

      if (login == null || login.isEmpty) {
        return 'Please enter login or email address';
      }
      else if (login.length < 5) {
        return "Login is too short";
      }
      else if (login.length > 20) {
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
      }
      else if (password.length < 7) {
        return "Password is too short";
      }
      else if (password.length > 256) {
        return "Password is too long";
      }

      return null;
    }

    void loginAttempt() async {
      SystemChannels.textInput.invokeMethod('TextInput.hide');

      if (_formKey.currentState!.validate()) {
        LoginStatus status = await RequestHelper().login(name: loginController.text, password: passwordController.text);

        switch (status) {
          case LoginStatus.Success:
            // TODO: replace this screen with campaign screen
            break;
          case LoginStatus.IncorrectData:
            isLoginCorrect = isPasswordCorrect = false;
            final snackBar = SnackBar(
              content: Text("Ay, that data doesn't match, does it?"),
              dismissDirection: DismissDirection.horizontal,
            );

            _formKey.currentState!.validate();
            ScaffoldMessenger.of(context).showSnackBar(snackBar);
            break;
          case LoginStatus.ServerError:
            final snackBar = SnackBar(
              content: Text("Server is under geth attack, try again later."),
              dismissDirection: DismissDirection.horizontal,
            );

            ScaffoldMessenger.of(context).showSnackBar(snackBar);
            break;
        }
      }
    }

    return Container(
      child: Stack(
        alignment: AlignmentDirectional.topCenter,
        children: [
          ConstrainedBox(
            constraints: BoxConstraints(
              maxWidth: 330,
            ),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(0, 59, 0, 0),
              child: Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.all(Radius.circular(10)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        height: 64,
                        width: 240,
                      ),
                      Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            TextFormField(
                              decoration: InputDecoration(
                                  helperText: " ", labelText: "Login or email"),
                              controller: loginController,
                              validator: validateLogin,
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(vertical: 6),
                              child: TextFormField(
                                obscureText: true,
                                enableSuggestions: false,
                                autocorrect: false,
                                decoration: InputDecoration(
                                    helperText: " ", labelText: "Password"),
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
                                Navigator.pushNamed(context, "/settings");
                              },
                              child: const Text('LOGIN'),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          SvgPicture.asset(
            "assets/campaign_logo.svg",
            height: 118,
          ),
        ],
      ),
    );
  }
}
