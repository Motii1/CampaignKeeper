import 'package:campaign_keeper_mobile/components/tiles/keeper_object_tile.dart';
import 'package:campaign_keeper_mobile/entities/object_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/search_controllers/base_search_controller.dart';
import 'package:flutter/material.dart';

class ObjectSearchController extends BaseSearchController<ObjectEntity> {
  int schemaId;

  ObjectSearchController({required this.schemaId, String heroTag = 'search'}) : super(heroTag: heroTag);

  @override
  List filterEntities(String input) {
    List list = DataCarrier()
        .getList<ObjectEntity>(groupId: schemaId)
        .where((element) => element.title.toLowerCase().contains(input.toLowerCase()))
        .toList();

    return list;
  }

  @override
  Widget createWidget(BuildContext context, Object entity) {
    var objectEnt = entity as ObjectEntity;

    return KeeperObjectTile(
      entity: objectEnt,
      onTap: () {
        Navigator.of(context)
            .pushReplacementNamed('/start/campaign/schema_objects/object_explorer', arguments: objectEnt.id);
      },
    );
  }
}
