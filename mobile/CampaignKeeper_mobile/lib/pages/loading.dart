import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/services/request_helper.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:flutter_svg/flutter_svg.dart';

class Loading extends StatefulWidget {
  @override
  _LoadingState createState() => _LoadingState();
}

class _LoadingState extends State<Loading> {
  void autoLogin() async {
    await AppPrefs().refresh(context);
    precachePicture(ExactAssetPicture(SvgPicture.svgStringDecoderBuilder, 'assets/campaign_logo.svg'), context);
    LoginStatus status = await RequestHelper().autoLogin();
    await Future.delayed(Duration(milliseconds: 500));

    switch (status) {
      case LoginStatus.Success:
        // TODO: replace settings with campaign screen
        Navigator.pushReplacementNamed(context, "/settings");
        break;
      case LoginStatus.ServerError:
        // TODO: campaign screen with argument for snackbar with offline info "Can't connect to the matrix, using local data."
        Navigator.pushReplacementNamed(context, "/settings");
        break;
      default:
        Navigator.pushReplacementNamed(context, "/login");
        break;
    }
  }

  @override
  void initState() {
    super.initState();
    autoLogin();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(0),
        child: AppBar(),
      ),
      body: Center(
        child: SpinKitRing(
          color: Theme.of(context).colorScheme.onBackground,
          size: 40.0,
          lineWidth: 5.0,
        ),
      ),
    );
  }
}
