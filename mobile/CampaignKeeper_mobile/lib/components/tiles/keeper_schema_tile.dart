import 'package:campaign_keeper_mobile/entities/schema_ent.dart';
import 'package:flutter/material.dart';

// List element representing a schema.
class KeeperSchemaTile extends StatelessWidget {
  const KeeperSchemaTile({Key? key, required this.entity, this.onTap}) : super(key: key);

  final SchemaEntity entity;
  final void Function()? onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(
        entity.title,
        style: TextStyle(
          fontWeight: FontWeight.w500,
          fontSize: 18,
        ),
      ),
      onTap: onTap,
    );
  }
}
