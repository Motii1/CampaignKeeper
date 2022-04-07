import 'package:flutter/material.dart';

class KeeperListTile extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget? leading;
  final void Function()? onTap;

  const KeeperListTile({Key? key, required this.title, this.subtitle, this.leading, this.onTap})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: leading ??
          SizedBox(
            width: 1,
            height: 1,
          ),
      title: Text(title),
      subtitle: subtitle == null ? null : Text(subtitle!),
      onTap: onTap,
    );
  }
}
