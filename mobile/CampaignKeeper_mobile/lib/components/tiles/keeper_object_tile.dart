import 'package:campaign_keeper_mobile/entities/object_ent.dart';
import 'package:flutter/material.dart';

// List element representing an object.
class KeeperObjectTile extends StatelessWidget {
  const KeeperObjectTile({Key? key, required this.entity, this.onTap}) : super(key: key);

  final ObjectEntity entity;
  final void Function()? onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(
        entity.title,
        style: TextStyle(
          fontWeight: FontWeight.w500,
          fontSize: 18,
          overflow: TextOverflow.ellipsis,
        ),
      ),
      onTap: onTap,
    );
  }
}
