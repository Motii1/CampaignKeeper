import 'package:campaign_keeper_mobile/entities/object_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/material.dart';

// Lisr element presenting FieldValues with a header.
class KeeperChipTile extends StatelessWidget {
  const KeeperChipTile({Key? key, required this.fieldName, required this.values, this.padding})
      : super(key: key);
  final String fieldName;
  final List<FieldValue> values;
  final EdgeInsets? padding;

  // isBackground determines if chips should be drawn with a rectangle backrgound
  // or just rounded outline, as Flutter can't do both at the same time.
  Widget formatValue(BuildContext context, FieldValue value) {
    return InputChip(
      label: Text(
        value.type == FieldValueType.Text
            ? value.text
            : DataCarrier().get<ObjectEntity>(entId: value.id)?.title ?? "No Data",
        style: TextStyle(
          color: value.type == FieldValueType.Text
              ? Theme.of(context).colorScheme.background
              : Theme.of(context).colorScheme.onPrimary,
        ),
      ),
      backgroundColor: value.type == FieldValueType.Text
          ? Theme.of(context).colorScheme.onBackground
          : Theme.of(context).colorScheme.primary,
      onPressed: () {},
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padding ?? EdgeInsets.symmetric(horizontal: 9, vertical: 4.5),
      child: Card(
        child: Padding(
          padding: EdgeInsets.fromLTRB(14, 14, 14, 7),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                fieldName,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                  color: Theme.of(context).colorScheme.onBackground,
                ),
              ),
              SizedBox(
                height: 5,
              ),
              Wrap(
                direction: Axis.horizontal,
                spacing: 7,
                children: values.map((e) => formatValue(context, e)).toList(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
