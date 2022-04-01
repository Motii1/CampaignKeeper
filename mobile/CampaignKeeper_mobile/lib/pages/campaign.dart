import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_search_bar.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/types/types.dart';
import 'package:flutter/material.dart';

class Campaign extends StatefulWidget {
  Campaign({Key? key}) : super(key: key);

  @override
  State<Campaign> createState() => _CampaignState();
}

class _CampaignState extends KeeperState<Campaign> {
  CampaignArgument? args;
  CampaignEntity? campaign;
  int currentPage = 0;

  Future<void> onRefresh() async {
    DataCarrier().refresh<UserDataEntity>();
    await DataCarrier().refresh<CampaignEntity>();
    // refresh sessions and / or codex
  }

  void returnToStart() {
    Navigator.popUntil(context, ModalRoute.withName('/start'));
  }

  Future<void> onCampaignRefresh() async {
    if (args != null) {
      CampaignEntity? entity = DataCarrier().getEntity(entId: args!.id);
      if (entity == null) {
        returnToStart();
      } else {
        setState(() {
          campaign = entity;
        });
      }
    }
  }

  @override
  void onResume() async {
    DataCarrier().refresh<CampaignEntity>();
    // refresh sessions and / or codex
  }

  @override
  void initState() {
    super.initState();
    DataCarrier().addListener<CampaignEntity>(onCampaignRefresh);
    DataCarrier().refresh<CampaignEntity>();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    args = ModalRoute.of(context)!.settings.arguments as CampaignArgument?;
    onCampaignRefresh();
  }

  @override
  void dispose() {
    DataCarrier().removeListener<CampaignEntity>(onCampaignRefresh);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: KeeperSearchBar(
          title: campaign?.name ?? '',
          popup: KeeperPopup.settings(context),
          onRefresh: onRefresh,
          sliver: SliverFillRemaining(
            hasScrollBody: false,
            child: Center(
              child: Text(
                "There's nothing here.\nStart new adventures on our website!",
                textAlign: TextAlign.center,
              ),
            ),
          )),
      bottomNavigationBar: NavigationBar(
        onDestinationSelected: (int index) {
          setState(() {
            currentPage = index;
          });
        },
        selectedIndex: currentPage,
        destinations: [
          NavigationDestination(icon: Icon(Icons.list), label: "Sessions"),
          NavigationDestination(
              icon: Icon(Icons.book_outlined), selectedIcon: Icon(Icons.book), label: "Codex"),
        ],
      ),
    );
  }
}
