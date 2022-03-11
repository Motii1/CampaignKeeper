import 'package:campaign_keeper_mobile/components/keeper_app_bar.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/components/keeper_campaign_title.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:flutter/material.dart';

class Campaigns extends StatefulWidget {
  const Campaigns({Key? key}) : super(key: key);

  @override
  _CampaignsState createState() => _CampaignsState();
}

class _CampaignsState extends KeeperState<Campaigns> {
  List<CampaignEntity> _entities = [];

  Future<void> onRefresh() async {
    DataCarrier().refresh<UserDataEntity>();
    await DataCarrier().refresh<CampaignEntity>();
  }

  Future<void> refreshScreen() async {
    setState(() {
      _entities = DataCarrier().getEntities<CampaignEntity>();
    });
  }

  @override
  void onResume() async {
    DataCarrier().refresh<CampaignEntity>();
  }

  @override
  void onEveryResume() async {
    DataCarrier().refresh<UserDataEntity>();
  }

  @override
  void initState() {
    super.initState();
    DataCarrier().addListener<CampaignEntity>(refreshScreen);
    DataCarrier().refresh<CampaignEntity>();
  }

  @override
  void dispose() {
    DataCarrier().removeListener<CampaignEntity>(refreshScreen);
    super.dispose();
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
        onRefresh: onRefresh,
        sliver: _entities.isEmpty
            ? SliverFillRemaining(
                hasScrollBody: false,
                child: Center(
                  child: Text(
                    "There's nothing here.\nStart new adventures on our website!",
                    textAlign: TextAlign.center,
                  ),
                ),
              )
            : SliverList(
                delegate: SliverChildBuilderDelegate((BuildContext context, int index) {
                return KeeperCampaignTile(entity: _entities[index]);
              }, childCount: _entities.length)),
      ),
    );
  }
}
