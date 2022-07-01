import 'dart:collection';
import 'dart:math';
import 'package:campaign_keeper_mobile/components/graph/event_node.dart';
import 'package:campaign_keeper_mobile/components/graph/start_node.dart';
import 'package:campaign_keeper_mobile/entities/event_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:flutter/material.dart';
import 'package:graphview/GraphView.dart';

class EventFacade {
  final startKey = GlobalKey();
  Map<int, EventEntity> _eventMap = {};

  SugiyamaConfiguration getBuilder() {
    return SugiyamaConfiguration()
      ..levelSeparation = 100
      ..nodeSeparation = 25
      ..iterations = 20
      ..orientation = SugiyamaConfiguration.ORIENTATION_TOP_BOTTOM;
  }

  Graph getGraph(int sessionId) {
    final Graph graph = Graph();

    final startNode = Node.Id(0);

    var events = DataCarrier().getList<EventEntity>(groupId: sessionId);
    _eventMap = Map.fromIterable(events, key: (e) => e.id, value: (e) => e);
    var nodeMap = Map.fromIterable(events, key: (e) => e.id, value: (e) => Node.Id(e.id));

    var q = Queue.from(events.where((e) => e.parentIds.length == 0).map((e) => e.id));
    if (q.isNotEmpty) {
      while (q.isNotEmpty) {
        var id = q.removeFirst();
        var node = nodeMap[id] as Node;
        var event = _eventMap[id] as EventEntity;

        if (event.parentIds.isEmpty) {
          graph.addEdge(startNode, node);
        } else {
          event.parentIds.forEach((e) {
            graph.addEdge(nodeMap[e]!, node);
          });
        }

        event.childrenIds.forEach((e) {
          q.add(e);
        });
      }
    } else {
      graph.addNode(startNode);
    }

    return graph;
  }

  Widget getNodeWidget(BuildContext context, int id) {
    if (id == 0) {
      return KeeperStartNode(
        key: startKey,
      );
    }

    return KeeperEventNode(entity: _eventMap[id]);
  }
}
