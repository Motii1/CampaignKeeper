import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_search_bar.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/search_controllers/base_search_controller.dart';
import 'package:campaign_keeper_mobile/search_controllers/campaign_search_controller.dart';
import 'package:flutter/material.dart';

class Campaign extends StatefulWidget {
  Campaign({Key? key, required this.campaignID}) : super(key: key);
  final int campaignID;

  @override
  State<Campaign> createState() => _CampaignState();
}

class _CampaignState extends KeeperState<Campaign> {
  CampaignEntity? campaign;
  BaseSearchController? searchController = CampaignSearchController();
  int currentPage = 0;

  Future<void> onRefresh() async {
    await DataCarrier().refresh<UserDataEntity>();
    await DataCarrier().refresh<CampaignEntity>();
    // refresh sessions and / or codex
  }

  void returnToStart() {
    Navigator.popUntil(context, ModalRoute.withName('/start'));
  }

  Future<void> onCampaignRefresh() async {
    CampaignEntity? entity = DataCarrier().get(entId: widget.campaignID);
    if (entity == null) {
      returnToStart();
    } else {
      setState(() {
        campaign = entity;
      });
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
          searchController: searchController,
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
            // TODO: change this one to a proper controller when sessions and codex api will be available
            searchController = index == 0 ? CampaignSearchController() : null;
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
