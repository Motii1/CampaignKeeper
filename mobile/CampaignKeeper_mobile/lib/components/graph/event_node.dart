import 'package:campaign_keeper_mobile/components/tiles/keeper_chip_tile.dart';
import 'package:campaign_keeper_mobile/components/tiles/keeper_field_tile.dart';
import 'package:campaign_keeper_mobile/entities/event_ent.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/material.dart';

// Widget representing a node of the event graph.
class KeeperEventNode extends StatelessWidget {
  final EventEntity? entity;
  final bool forceShow;
  final void Function()? onTap;
  final List<FieldValue> characterValues = [];
  final List<FieldValue> placeValues = [];
  final List<FieldValue> descriptionValues = [];

  KeeperEventNode({Key? key, required this.entity, this.forceShow = false, this.onTap}) : super(key: key) {
    if (entity != null) {
      var charValues = entity!.characterValues.where((e) => e.fieldName == 'characters').toList()
        ..sort(((a, b) => a.sequence.compareTo(b.sequence)));
      characterValues.addAll(charValues);

      var plValues = entity!.placeValues.where((e) => e.fieldName == 'places').toList()
        ..sort(((a, b) => a.sequence.compareTo(b.sequence)));
      placeValues.addAll(plValues);

      var desValues = entity!.descriptionValues.where((e) => e.fieldName == 'descriptions').toList()
        ..sort(((a, b) => a.sequence.compareTo(b.sequence)));
      descriptionValues.addAll(desValues);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Theme.of(context).colorScheme.background,
      borderRadius: BorderRadius.circular(16),
      clipBehavior: Clip.antiAlias,
      child: Opacity(
        opacity: entity?.isOmitted ?? false ? 0.8 : 1,
        child: Material(
          color: (entity?.isFight ?? false)
              ? Theme.of(context).colorScheme.error
              : Theme.of(context).colorScheme.primary,
          borderRadius: BorderRadius.circular(16),
          clipBehavior: Clip.antiAlias,
          child: InkWell(
            onTap: onTap,
            child: Padding(
              padding: EdgeInsets.all(3.5),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Padding(
                    padding: EdgeInsets.only(top: 3, bottom: 3.5),
                    child: Text(
                      entity?.title ?? "No Data",
                      textAlign: TextAlign.center,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onPrimary,
                        fontWeight: FontWeight.w500,
                        fontSize: 18,
                      ),
                    ),
                  ),
                  Visibility(
                    visible: (entity?.isShown ?? true) || forceShow,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        KeeperChipTile(
                          fieldName: "Places",
                          values: placeValues,
                          padding: EdgeInsets.zero,
                          isProminent: entity?.isFight ?? false,
                        ),
                        KeeperChipTile(
                          fieldName: "Characters",
                          values: characterValues,
                          padding: EdgeInsets.zero,
                          isProminent: entity?.isFight ?? false,
                        ),
                        KeeperFieldTile(
                          fieldName: "Description",
                          values: descriptionValues,
                          padding: EdgeInsets.zero,
                          isProminent: entity?.isFight ?? false,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
