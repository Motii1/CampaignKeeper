import 'package:flutter/material.dart';

// List element presenting a centered title.
class KeeperTitleTile extends StatelessWidget {
  const KeeperTitleTile({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: EdgeInsets.only(top: 7, bottom: 17.5),
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 25,
              fontWeight: FontWeight.w500,
              color: Theme.of(context).colorScheme.onBackground,
            ),
          ),
        ),
        Container(
          constraints: BoxConstraints.expand(height: 1.5),
          color: Theme.of(context).colorScheme.onBackground.withAlpha(40),
        ),
      ],
    );
  }
}
