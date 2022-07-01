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
      ..levelSeparation = 90
      ..nodeSeparation = 25
      ..iterations = 20;
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

// Here it's a fixed SugiyamaAlgorithm from the graphview package that makes sure nodes don't overlap on each other.
class KeeperSugiyamaAlgorithm extends SugiyamaAlgorithm {
  KeeperSugiyamaAlgorithm(configuration) : super(configuration);

  @override
  void placeBlock(Node? v, Map<Node?, Node?> sink, Map<Node?, double> shift, Map<Node?, double?> x,
      Map<Node?, Node?> align, Map<Node?, double> blockWidth, Map<Node?, Node?> root, bool leftToRight) {
    if (x[v] == double.negativeInfinity) {
      var nodeSeparation = configuration.nodeSeparation;
      x[v] = 0;
      var currentNode = v;

      try {
        do {
          if (leftToRight && positionOfNode(currentNode) > 0 ||
              !leftToRight && positionOfNode(currentNode) < layers[getLayerIndex(currentNode)].length - 1) {
            final pred = predecessor(currentNode, leftToRight);
            final u = root[pred];
            placeBlock(u, sink, shift, x, align, blockWidth, root, leftToRight);
            if (sink[v] == v) {
              sink[v] = sink[u];
            }
            if (sink[v] != sink[u]) {
              if (leftToRight) {
                shift[sink[u]] = min(shift[sink[u]]!,
                    x[v]! - x[u]! - nodeSeparation - 0.5 * (blockWidth[u]! + blockWidth[v]!));
              } else {
                shift[sink[u]] = max(shift[sink[u]]!,
                    x[v]! - x[u]! + nodeSeparation + 0.5 * (blockWidth[u]! + blockWidth[v]!));
              }
            } else {
              if (leftToRight) {
                x[v] =
                    max(x[v]! + v!.width, x[u]! + nodeSeparation + 0.5 * (blockWidth[u]! + blockWidth[v]!));
              } else {
                x[v] =
                    min(x[v]! - v!.width, x[u]! - nodeSeparation - 0.5 * (blockWidth[u]! + blockWidth[v]!));
              }
            }
          }
          currentNode = align[currentNode];
        } while (currentNode != v);
      } catch (e) {
        print(e);
      }
    }
  }
}
