import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:flutter/material.dart';

class KeeperCampaignTile extends StatelessWidget {
  const KeeperCampaignTile(
      {Key? key, required this.entity, this.onTap})
      : super(key: key);

  final CampaignEntity entity;
  final void Function()? onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(5.0),
      child: Card(
        child: ClipRRect(
          borderRadius: BorderRadius.circular(10.0),
          child: InkWell(
            onTap: onTap,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                ConstrainedBox(
                  constraints: BoxConstraints(
                    maxHeight: 110,
                    minHeight: 110,
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(5.0),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(10.0),
                      child: FittedBox(
                        fit: BoxFit.fitWidth,
                        child: entity.image,
                      ),
                    ),
                  )
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Center(
                        child: Padding(
                      padding: const EdgeInsets.fromLTRB(10.0, 3.0, 10.0, 10.0),
                      child: Text(
                        entity.name,
                        style: Theme.of(context).textTheme.headline6,
                      ),
                    )),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
