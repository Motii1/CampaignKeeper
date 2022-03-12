import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/login_helper.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/types/types.dart';
import 'package:campaign_keeper_mobile/components/keeper_snack_bars.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:flutter_svg/flutter_svg.dart';

class Loading extends StatefulWidget {
  @override
  _LoadingState createState() => _LoadingState();
}

class _LoadingState extends State<Loading> {
  bool _loaded = false;

  void showStatus() {
    bool isOnline = RequestHelper().isOnline;
    ScaffoldMessengerState scaffold = ScaffoldMessenger.of(context);
    if (scaffold.mounted) {
      if (isOnline) {
        scaffold.showSnackBar(KeeperSnackBars().online);
      } else {
        scaffold.showSnackBar(KeeperSnackBars().offline);
      }
    }
  }

  void autoLogin() async {
    await AppPrefs().refresh(context);
    await DataCarrier().refresh<UserDataEntity>();
    ResponseStatus status = await LoginHelper().autoLogin();

    switch (status) {
      case ResponseStatus.Success:
      case ResponseStatus.TimeOut:
        Navigator.pushReplacementNamed(context, "/start");
        break;
      default:
        Navigator.pushReplacementNamed(context, "/login");
        break;
    }
  }

  Future<void> loadAssets() async {
    precachePicture(
        ExactAssetPicture(SvgPicture.svgStringDecoderBuilder, 'assets/campaign_logo.svg'), context);

    precacheImage(Image.asset("assets/user.png").image, context);
    precacheImage(Image.asset("assets/campaign_default.jpg").image, context);
  }

  @override
  void initState() {
    super.initState();
    RequestHelper().addListener(showStatus);
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
  void dispose() {
    RequestHelper().removeListener(showStatus);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(0),
        child: AppBar(),
      ),
      body: Column(
        children: [
          Expanded(
            child: Center(),
          ),
          Center(
            child: Padding(
              padding: EdgeInsets.only(bottom: 41),
              child: SvgPicture.asset(
                "assets/campaign_logo.svg",
                height: 95,
              ),
            ),
          ),
          Expanded(
            child: SpinKitRing(
              color: Theme.of(context).colorScheme.onBackground,
              size: 40.0,
              lineWidth: 5.0,
            ),
          ),
        ],
      ),
    );
  }
}
