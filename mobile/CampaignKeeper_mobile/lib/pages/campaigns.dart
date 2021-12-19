import 'package:campaign_keeper_mobile/components/keeper_app_bar.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/lifecycle_helper.dart';
import 'package:flutter/material.dart';

class Campaigns extends StatefulWidget {
  const Campaigns({Key? key}) : super(key: key);

  @override
  _CampaignsState createState() => _CampaignsState();
}

class _CampaignsState extends State<Campaigns> with WidgetsBindingObserver {
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) async {
    switch (state) {
      case AppLifecycleState.resumed:
        await LifeCycleHelper().loginOnResume(context);
        // TODO: refresh icon and list
        await DataCarrier().refresh<UserDataEntity>();
        break;
      default:
        break;
    }
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance!.addObserver(this);

    LifeCycleHelper().testConnectionOnResume(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: KeeperAppBar(
        autoLeading: false,
        title: "Campaigns",
        popupItemBuilder: (BuildContext context) => [
          PopupMenuItem<String>(
            value: "Settings",
            child: Text("Settings"),
          )
        ],
        popupOnSelected: (dynamic value) {
          switch (value) {
            case "Settings":
              Navigator.pushNamed(context, "/settings");
              break;
          }
        },
        sliver: SliverToBoxAdapter(
          child: Container(),
        ),
      ),
    );
  }
}
