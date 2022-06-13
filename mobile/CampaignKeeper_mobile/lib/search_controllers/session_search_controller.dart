import 'package:campaign_keeper_mobile/components/tiles/keeper_session_tile.dart';
import 'package:campaign_keeper_mobile/entities/session_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/search_controllers/base_search_controller.dart';
import 'package:flutter/material.dart';

class SessionSearchController extends BaseSearchController<SessionEntity> {
  int campaignId;

  SessionSearchController({required this.campaignId, String heroTag = 'search'}) : super(heroTag: heroTag);

  @override
  List filterEntities(String input) {
    List list = DataCarrier()
        .getList<SessionEntity>(groupId: campaignId)
        .where((element) => element.name.toLowerCase().contains(input.toLowerCase()))
        .toList();

    return list;
  }

  @override
  Widget createWidget(Object entity) {
    return KeeperSessionTile(entity: entity as SessionEntity);
  }
}
