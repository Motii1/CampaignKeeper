import 'package:campaign_keeper_mobile/entities/object_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

// List element presenting FieldValues with a header.
class KeeperFieldTile extends StatelessWidget {
  const KeeperFieldTile(
      {Key? key, required this.fieldName, required this.values, this.padding, this.isProminent = false})
      : super(key: key);
  final String fieldName;
  final List<FieldValue> values;
  final EdgeInsets? padding;
  final bool isProminent;

  // isBackground determines if chips should be drawn with a rectangle backrgound
  // or just rounded outline, as Flutter can't do both at the same time.
  InlineSpan formatValue(BuildContext context, FieldValue value, {bool isBackground = false}) {
    if (value.type == FieldValueType.Id) {
      return TextSpan(
        text: DataCarrier().get<ObjectEntity>(entId: value.id)?.title ?? "Error",
        style: TextStyle(
            color: isBackground ? Colors.transparent : Theme.of(context).colorScheme.onPrimary,
            fontSize: 16.5 - 1.5 / MediaQuery.textScaleFactorOf(context),
            fontWeight: FontWeight.w500,
            background: Paint()
              ..color = Theme.of(context).colorScheme.primary
              ..strokeCap = StrokeCap.round
              ..strokeJoin = StrokeJoin.round
              ..strokeWidth = 5
              ..style = isBackground ? PaintingStyle.fill : PaintingStyle.stroke),
        recognizer: TapGestureRecognizer()
          ..onTap = () {
            if (!isBackground) {
              Navigator.of(context)
                  .pushNamed('/start/campaign/schema_objects/object_explorer', arguments: value.id);
            }
          },
      );
    }

    return TextSpan(
      text: value.text,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padding ?? EdgeInsets.symmetric(horizontal: 9, vertical: 4.5),
      child: Card(
        color: isProminent
            ? Color.alphaBlend(
                Theme.of(context).colorScheme.error.withOpacity(0.3), Theme.of(context).colorScheme.surface)
            : null,
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
                        fontSize: 16.5,
                        fontWeight: FontWeight.w400,
                        color: Colors.transparent,
                      ),
                      children: values.map((e) => formatValue(context, e, isBackground: true)).toList(),
                    ),
                  ),
                  RichText(
                    text: TextSpan(
                      style: TextStyle(
                        fontSize: 16.5,
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
