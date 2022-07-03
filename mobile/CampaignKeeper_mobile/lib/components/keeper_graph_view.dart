import 'dart:collection';
import 'package:collection/collection.dart';
import 'package:campaign_keeper_mobile/components/graph/event_node.dart';
import 'package:campaign_keeper_mobile/components/graph/start_node.dart';
import 'package:campaign_keeper_mobile/entities/event_ent.dart';
import 'package:flutter/material.dart';
import 'package:graphview/GraphView.dart';

class KeeperGraphView extends StatelessWidget {
  const KeeperGraphView({Key? key, required this.events, required this.startKey}) : super(key: key);
  final List<EventEntity> events;
  final startKey;

  SugiyamaConfiguration getBuilder() {
    return SugiyamaConfiguration()
      ..levelSeparation = 100
      ..nodeSeparation = 25
      ..iterations = 20
      ..orientation = SugiyamaConfiguration.ORIENTATION_TOP_BOTTOM;
  }

  Graph getGraph() {
    final Graph graph = Graph();

    final startNode = Node.Id(0);

    var eventMap = Map.fromIterable(events, key: (e) => e.id, value: (e) => e);
    var nodeMap = Map.fromIterable(events, key: (e) => e.id, value: (e) => Node.Id(e.id));
    Set<int> visibleNodes = {};

    var q = Queue.from(events.where((e) => e.parentIds.length == 0).map((e) => e.id));
    if (q.isNotEmpty) {
      while (q.isNotEmpty) {
        var id = q.removeFirst();
        var node = nodeMap[id] as Node;
        var event = eventMap[id] as EventEntity;

        if (event.parentIds.isEmpty) {
          graph.addEdge(startNode, node);
        } else {
          event.parentIds.forEach((e) {
            if (visibleNodes.contains(e)) {
              graph.addEdge(nodeMap[e]!, node);
            }
          });
        }

        if (event.displayStatus.toLowerCase() == 'shown') {
          visibleNodes.add(id);
          event.childrenIds.forEach((e) {
            q.add(e);
          });
        }
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

    return KeeperEventNode(entity: events.firstWhereOrNull((e) => e.id == id));
  }

  @override
  Widget build(BuildContext context) {
    return GraphView(
      graph: getGraph(),
      algorithm: SugiyamaAlgorithm(getBuilder()),
      paint: Paint()
        ..color = Theme.of(context).colorScheme.onBackground
        ..strokeWidth = 2.5
        ..style = PaintingStyle.stroke,
      builder: (Node node) {
        var id = node.key?.value as int;
        return getNodeWidget(context, id);
      },
    );
  }
}
