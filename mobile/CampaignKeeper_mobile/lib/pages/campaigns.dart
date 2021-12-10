import 'package:campaign_keeper_mobile/components/keeper_app_bar.dart';
import 'package:campaign_keeper_mobile/services/lifecycle_helper.dart';
import 'package:flutter/material.dart';

class Campaigns extends StatefulWidget {
  const Campaigns({Key? key}) : super(key: key);

  @override
  _CampaignsState createState() => _CampaignsState();
}

class _CampaignsState extends State<Campaigns> {
  @override
  void initState() {
    super.initState();
    LifeCycleHelper().testConnectionOnResume(context);
  }

  // TODO: on resume testing

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: KeeperAppBar(
        title: "Campaigns",
        sliver: SliverToBoxAdapter(
          child: Container(),
        ),
      ),
    );
  }
}

