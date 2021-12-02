import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class KeeperLogoCard extends StatelessWidget {
  const KeeperLogoCard({Key? key, required this.child}) : super(key: key);

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Stack(
        alignment: AlignmentDirectional.topCenter,
        children: [
          ConstrainedBox(
            constraints: BoxConstraints(
              maxWidth: 325,
              minWidth: 325,
            ),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(0, 59, 0, 0),
              child: Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.all(Radius.circular(10)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        height: 64,
                        width: 240,
                      ),
                      child,
                    ],
                  ),
                ),
              ),
            ),
          ),
          SvgPicture.asset(
            "assets/campaign_logo.svg",
            height: 118,
          ),
        ],
      ),
    );
  }
}
