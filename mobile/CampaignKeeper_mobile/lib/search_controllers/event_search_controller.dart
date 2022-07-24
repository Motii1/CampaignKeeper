import 'package:campaign_keeper_mobile/components/graph/event_node.dart';
import 'package:campaign_keeper_mobile/entities/event_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/search_controllers/base_search_controller.dart';
import 'package:flutter/material.dart';

class EventSearchController extends BaseSearchController<EventEntity> {
  final int sessionId;

  const EventSearchController({required this.sessionId, String heroTag = 'search'}) : super(heroTag: heroTag);

  @override
  List filterEntities(String input) {
    List list = DataCarrier()
        .getList<EventEntity>(groupId: sessionId)
        .where((element) => element.title.toLowerCase().contains(input.toLowerCase()))
        .toList();

    return list;
  }

  @override
  Widget createWidget(BuildContext context, Object entity) {
    var objectEnt = entity as EventEntity;

    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      child: KeeperEventNode(
        entity: objectEnt,
        forceShow: true,
        onTap: () {
          Navigator.of(context)
              .pushReplacementNamed('/start/campaign/session_map/event_explorer', arguments: objectEnt.id);
        },
      ),
    );
  }
}
