import 'package:flutter/material.dart';

class KeeperImageTile extends StatelessWidget {
  const KeeperImageTile({Key? key, this.image}) : super(key: key);
  final Image? image;

  @override
  Widget build(BuildContext context) {
    return image == null
        ? Container()
        : Padding(
            padding: EdgeInsets.all(15),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(22),
              child: image,
            ),
          );
  }
}
