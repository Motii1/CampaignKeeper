import 'package:flutter/material.dart';

// Widget used as a header in ordinary lists
// like settings page.
class KeeperListHeader extends StatelessWidget {
  final String title;
  const KeeperListHeader({Key? key, required this.title}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(71, 10, 18, 2),
      child: Text(
        title.toUpperCase(),
        style: Theme.of(context).textTheme.subtitle2,
      ),
    );
  }
}
