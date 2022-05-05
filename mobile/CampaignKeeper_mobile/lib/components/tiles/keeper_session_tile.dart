import 'package:campaign_keeper_mobile/entities/session_ent.dart';
import 'package:flutter/material.dart';

// List element representing a session.
class KeeperSessionTile extends StatelessWidget {
  const KeeperSessionTile({Key? key, required this.entity, this.onTap}) : super(key: key);

  final SessionEntity entity;
  final void Function()? onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(
        entity.name,
        style: TextStyle(
          fontWeight: FontWeight.w500,
          fontSize: 18,
        ),
      ),
      onTap: onTap,
    );
  }
}
