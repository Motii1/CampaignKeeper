import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_login_ent.dart';
import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/services/screen_arguments.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:flutter_svg/flutter_svg.dart';

class Loading extends StatefulWidget {
  @override
  _LoadingState createState() => _LoadingState();
}

class _LoadingState extends State<Loading> {
  bool _loaded = false;

  void autoLogin() async {
    await AppPrefs().refresh(context);

    await DataCarrier().refresh<UserLoginEntity>();

    LoginStatus status = await RequestHelper().autoLogin();

    await DataCarrier().refresh<UserDataEntity>();

    switch (status) {
      case LoginStatus.Success:
        Navigator.pushReplacementNamed(context, "/campaigns");
        break;
      case LoginStatus.ServerError:
        Navigator.pushReplacementNamed(context, "/campaigns", arguments: ScreenArguments("connection", "false"));
        break;
      default:
        Navigator.pushReplacementNamed(context, "/login");
        break;
    }
  }

  Future<void> loadAssets() async {
    precachePicture(
        ExactAssetPicture(
            SvgPicture.svgStringDecoderBuilder, 'assets/campaign_logo.svg'),
        context);

    precacheImage(Image.asset("assets/user.png").image, context);
    precacheImage(Image.asset("assets/campaign_default.jpg").image, context);
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  void didChangeDependencies() async {
    if (!_loaded) {
      _loaded = true;
      super.didChangeDependencies();
      await loadAssets();
      autoLogin();
    }
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
