import 'package:campaign_keeper_mobile/components/keeper_app_bar.dart';
import 'package:campaign_keeper_mobile/components/keeper_campaign_title.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
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
  List<CampaignEntity> _entities = [];

  void refresh() async {
    await DataCarrier().refresh<CampaignEntity>();

    setState(() {
      _entities = DataCarrier().getEntities<CampaignEntity>();
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) async {
    switch (state) {
      case AppLifecycleState.resumed:
        await LifeCycleHelper().loginOnResume(context);
        await DataCarrier().refresh<UserDataEntity>();
        await DataCarrier().refresh<CampaignEntity>();
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

    DataCarrier().addListener<CampaignEntity>(refresh);
    //TODO: Should be refresh on DC
    refresh();
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
        sliver: _entities.isEmpty
            ? SliverFillRemaining(
                child: Center(
                  child: Text(
                    "There's nothing here.\nStart new adventures on our website!",
                    textAlign: TextAlign.center,
                  ),
                ),
              )
            : SliverList(
                delegate: SliverChildBuilderDelegate(
                    (BuildContext context, int index) {
                return KeeperCampaignTile(entity: _entities[index]);
              }, childCount: _entities.length)),
      ),
    );
  }
}
