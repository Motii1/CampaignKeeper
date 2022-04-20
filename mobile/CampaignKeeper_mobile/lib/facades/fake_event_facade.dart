import 'package:flutter/material.dart';
import 'package:graphview/GraphView.dart';

class FakeEventFacade {
  SugiyamaConfiguration getBuilder() {
    return SugiyamaConfiguration()
      ..levelSeparation = 55
      ..nodeSeparation = 25
      ..iterations = 20;
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
