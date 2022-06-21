import 'package:campaign_keeper_mobile/entities/object_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

class KeeperFieldTile extends StatelessWidget {
  const KeeperFieldTile({Key? key, required this.fieldName, required this.values}) : super(key: key);
  final String fieldName;
  final List<FieldValue> values;

  InlineSpan formatValue(BuildContext context, FieldValue value, {bool background = false}) {
    if (value.type == FieldValueType.Id) {
      return TextSpan(
        text: DataCarrier().get<ObjectEntity>(entId: value.id)?.title ?? "Error",
        style: TextStyle(
            color: background ? Colors.transparent : Theme.of(context).colorScheme.onPrimary,
            fontSize: 15.5,
            fontWeight: FontWeight.w500,
            background: Paint()
              ..color = Theme.of(context).colorScheme.primary
              ..strokeCap = StrokeCap.round
              ..strokeJoin = StrokeJoin.round
              ..strokeWidth = 5
              ..style = background ? PaintingStyle.fill : PaintingStyle.stroke),
        recognizer: TapGestureRecognizer()
          ..onTap = () {
            if (!background) {
              Navigator.of(context)
                  .pushNamed('/start/campaign/schema_objects/object_explorer', arguments: value.id);
            }
          },
      );
    }

    return TextSpan(
      text: value.text,
      style: !background
          ? null
          : TextStyle(
              color: Colors.transparent,
            ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 9, vertical: 4.5),
      child: Card(
        child: Padding(
          padding: EdgeInsets.all(14),
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
                height: 10,
              ),
              Stack(
                children: [
                  RichText(
                    text: TextSpan(
                      style: TextStyle(
                        fontSize: 17.5,
                        fontWeight: FontWeight.w400,
                        color: Theme.of(context).colorScheme.onBackground,
                      ),
                      children: values.map((e) => formatValue(context, e, background: true)).toList(),
                    ),
                  ),
                  RichText(
                    text: TextSpan(
                      style: TextStyle(
                        fontSize: 17.5,
                        fontWeight: FontWeight.w400,
                        color: Theme.of(context).colorScheme.onBackground,
                      ),
                      children: values.map((e) => formatValue(context, e)).toList(),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
