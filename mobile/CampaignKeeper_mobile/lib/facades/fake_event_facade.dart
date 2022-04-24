import 'dart:math';
import 'package:flutter/material.dart';
import 'package:graphview/GraphView.dart';

class FakeEventFacade {
  SugiyamaConfiguration getBuilder() {
    return SugiyamaConfiguration()
      ..levelSeparation = 75
      ..nodeSeparation = 5
      ..iterations = 10;
  }

  Graph getGraph() {
    final Graph graph = Graph();

    final node1 = Node.Id(1);
    final node2 = Node.Id(2);
    final node3 = Node.Id(3);
    final node4 = Node.Id(4);
    final node5 = Node.Id(5);
    final node6 = Node.Id(6);
    final node8 = Node.Id(7);
    final node7 = Node.Id(8);
    final node9 = Node.Id(9);
    final node10 = Node.Id(10);
    final node11 = Node.Id(11);
    final node12 = Node.Id(12);

    graph.addEdge(node1, node2);
    graph.addEdge(node1, node3);
    graph.addEdge(node1, node4);
    graph.addEdge(node2, node5);
    graph.addEdge(node2, node6);
    graph.addEdge(node4, node9);
    graph.addEdge(node4, node10);
    graph.addEdge(node4, node11);
    graph.addEdge(node6, node7);
    graph.addEdge(node6, node8);
    graph.addEdge(node9, node6);
    graph.addEdge(node11, node12);

    return graph;
  }

  Widget getNodeWidget(BuildContext context, int id) {
    return SizedBox(
      width: 90,
      height: id % 2 == 0 ? 70 : null,
      child: Material(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(10),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () {
            print("Move me to the event screen");
          },
          child: Center(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              child: Text("Node ${id}"),
            ),
          ),
        ),
      ),
    );
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
