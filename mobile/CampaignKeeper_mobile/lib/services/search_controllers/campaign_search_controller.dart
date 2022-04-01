import 'package:campaign_keeper_mobile/components/keeper_campaign_tile.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/search_controllers/base_search_controller.dart';
import 'package:flutter/material.dart';

class CampaignSearchController extends BaseSearchController<CampaignEntity> {
  @override
  List filterEntities(String input) {
    List list = DataCarrier()
        .getEntities<CampaignEntity>()
        .where((element) => element.name.toLowerCase().contains(input.toLowerCase()))
        .toList();

    return list;
  }

  @override
  Widget createWidget(Object entity) {
    return KeeperCampaignTile(entity: entity as CampaignEntity);
  }
}
