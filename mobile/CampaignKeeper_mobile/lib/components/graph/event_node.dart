import 'package:campaign_keeper_mobile/entities/event_ent.dart';
import 'package:flutter/material.dart';

class KeeperEventNode extends StatelessWidget {
  final EventEntity? entity;

  const KeeperEventNode({Key? key, required this.entity}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: BoxConstraints(
        maxHeight: double.infinity,
        maxWidth: 260,
        minHeight: 140,
        minWidth: 260,
      ),
      child: Material(
        color: Theme.of(context).colorScheme.primary,
        borderRadius: BorderRadius.circular(10),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () {
            print("Move me to the event screen");
          },
          child: Center(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              child: Text("Node ${entity?.id ?? 'Error'}"),
            ),
          ),
        ),
      ),
    );
  }
}
