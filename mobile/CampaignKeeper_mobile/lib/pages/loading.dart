import 'package:campaign_keeper_mobile/components/keeper_scaffold.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/database_helper.dart';
import 'package:campaign_keeper_mobile/services/helpers/login_helper.dart';
import 'package:campaign_keeper_mobile/types/http_types.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:flutter_svg/flutter_svg.dart';

// Page responsible for loading basic functionality.
// It's main task is to auto login user - either
// by doing an api request or by loading cached
// information if api is not available. If neither can
// succeed user is transfered to the login page.
class Loading extends StatefulWidget {
  @override
  _LoadingState createState() => _LoadingState();
}

class _LoadingState extends State<Loading> {
  bool _loaded = false;

  void autoLogin() async {
    await AppPrefs().refresh(context);
    await DataCarrier().refresh<UserDataEntity>(online: false);

    var tuple = await LoginHelper().autoLogin();
    ResponseStatus status = tuple.first;
    UserDataEntity? userEnt = tuple.second;

    switch (status) {
      case ResponseStatus.Success:
        await DataCarrier().attach(userEnt!);
        await DataCarrier().refresh<CampaignEntity>();

        Navigator.pushReplacementNamed(context, "/start");
        break;
      case ResponseStatus.IncorrectData:
        await DataCarrier().clear();

        Navigator.pushReplacementNamed(context, "/login");
        break;
      default:
        if (userEnt == null) {
          Navigator.pushReplacementNamed(context, "/login");
        } else {
          await DataCarrier().attach(userEnt);
          await DataCarrier().refresh<CampaignEntity>(online: false);
          Navigator.pushReplacementNamed(context, "/start");
        }
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
  void didChangeDependencies() async {
    super.didChangeDependencies();
    if (!_loaded) {
      _loaded = true;

      await loadAssets();
      await DatabaseHelper().initialize();

      autoLogin();
    }
  }

  @override
  Widget build(BuildContext context) {
    return KeeperScaffold(
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
