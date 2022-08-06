import 'package:campaign_keeper_mobile/entities/object_ent.dart';
import 'package:flutter/material.dart';

// Grid element representing an object.
// Shows an image if available.
class KeeperObjectGridTile extends StatelessWidget {
  const KeeperObjectGridTile({Key? key, required this.entity, this.onTap}) : super(key: key);

  final ObjectEntity entity;
  final void Function()? onTap;

  bool get hasImage {
    return entity.imageData != null && entity.imageData != '';
  }

  List<Widget> getContent(BuildContext context) {
    List<Widget> widgets = [];

    if (hasImage) {
      widgets.add(
        SizedBox(
          height: 190,
          child: Padding(
            padding: const EdgeInsets.all(5.0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(10.0),
              child: FittedBox(
                fit: BoxFit.cover,
                child: entity.image,
              ),
            ),
          ),
        ),
      );
    }

    widgets.add(SizedBox(
      height: hasImage ? 40 : 60,
      child: Align(
        alignment: Alignment.centerLeft,
        child: Padding(
          padding: EdgeInsets.fromLTRB(11, hasImage ? 0 : 5, 11, 5),
          child: Text(
            entity.title,
            overflow: TextOverflow.ellipsis,
            maxLines: hasImage ? 1 : 2,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onSurface,
              fontSize: 18,
              fontWeight: FontWeight.normal,
            ),
          ),
        ),
      ),
    ));

    return widgets;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 5, horizontal: 5),
      child: SizedBox(
        height: hasImage ? 230 : 70,
        child: Material(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(10.0),
          clipBehavior: Clip.antiAlias,
          child: Stack(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisAlignment: MainAxisAlignment.center,
                children: getContent(context),
              ),
              Positioned.fill(
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: onTap,
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
