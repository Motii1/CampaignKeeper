import 'package:flutter/material.dart';

// Widget representing back arrow button.
// It can take custom padding and size constraints.
class KeeperBackButton extends StatelessWidget {
  const KeeperBackButton({Key? key, this.padding, this.constraints}) : super(key: key);
  final EdgeInsets? padding;
  final BoxConstraints? constraints;

  @override
  Widget build(BuildContext context) {
    return IconButton(
      constraints: constraints,
      onPressed: () {
        Navigator.pop(context);
      },
      padding: padding ?? EdgeInsets.symmetric(vertical: 0, horizontal: 14),
      icon: Icon(
        Icons.arrow_back,
        size: 23.5,
        color: Theme.of(context).colorScheme.onBackground.withOpacity(0.65),
      ),
    );
  }
}
