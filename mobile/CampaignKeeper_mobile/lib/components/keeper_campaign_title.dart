import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:flutter/material.dart';

class KeeperCampaignTile extends StatelessWidget {
  const KeeperCampaignTile({Key? key, this.fillImage = true, required this.entity}) : super(key: key);

  final CampaignEntity entity;
  final bool fillImage;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(5.0),
      child: Card(
        child: ClipRRect(
          borderRadius: BorderRadius.circular(10.0),
          child: ConstrainedBox(
            constraints: BoxConstraints(
              maxHeight: 70,
              minHeight: 70,
            ),
            child: Stack(children: [
              Positioned.fill(
                child: Opacity(
                  opacity: fillImage ? 0.25 : 0.0,
                  child: FittedBox(
                    fit: BoxFit.fitWidth,
                    child: entity.image,
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Center(
                      child: Padding(
                    padding: const EdgeInsets.all(17.0),
                    child: Text(
                      entity.name,
                      style: Theme.of(context).textTheme.headline6,
                    ),
                  )),
                  Expanded(child: Container()),
                  SizedBox(
                    height: 70,
                    width: fillImage ? 0 : 100,
                    child: FittedBox(
                      fit: BoxFit.fitHeight,
                      child: entity.image,
                    ),
                  ),
                ],
              ),
            ]),
          ),
        ),
      ),
    );
  }
}
