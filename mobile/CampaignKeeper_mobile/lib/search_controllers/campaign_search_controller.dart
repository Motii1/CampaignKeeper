import 'package:campaign_keeper_mobile/components/tiles/keeper_campaign_tile.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/search_controllers/base_search_controller.dart';
import 'package:flutter/material.dart';

class CampaignSearchController extends BaseSearchController<CampaignEntity> {
  const CampaignSearchController({String heroTag = 'search'}) : super(heroTag: heroTag);

  @override
  List filterEntities(String input) {
    List list = DataCarrier()
        .getList<CampaignEntity>()
        .where((element) => element.name.toLowerCase().contains(input.toLowerCase()))
        .toList();

    return list;
  }

  @override
  Widget createWidget(BuildContext context, Object entity) {
    return KeeperCampaignTile(entity: entity as CampaignEntity);
  }
}
