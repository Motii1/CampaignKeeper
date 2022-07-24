import 'package:campaign_keeper_mobile/components/tiles/keeper_schema_tile.dart';
import 'package:campaign_keeper_mobile/entities/schema_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/search_controllers/base_search_controller.dart';
import 'package:flutter/material.dart';

class SchemaSearchController extends BaseSearchController<SchemaEntity> {
  final int campaignId;

  const SchemaSearchController({required this.campaignId, String heroTag = 'search'})
      : super(heroTag: heroTag);

  @override
  List filterEntities(String input) {
    List list = DataCarrier()
        .getList<SchemaEntity>(groupId: campaignId)
        .where((element) => element.title.toLowerCase().contains(input.toLowerCase()))
        .toList();

    return list;
  }

  @override
  Widget createWidget(BuildContext context, Object entity) {
    var schemaEnt = entity as SchemaEntity;

    return KeeperSchemaTile(
      entity: schemaEnt,
      onTap: () {
        Navigator.of(context).pushReplacementNamed('/start/campaign/schema_objects', arguments: schemaEnt.id);
      },
    );
  }
}
