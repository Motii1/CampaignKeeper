import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/material.dart';

// List element presenting a text value with a header.
class KeeperTextTile extends StatelessWidget {
  const KeeperTextTile(
      {Key? key, required this.fieldName, required this.value, this.padding, this.isProminent = false})
      : super(key: key);
  final String fieldName;
  final String value;
  final EdgeInsets? padding;
  final bool isProminent;

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
          padding: EdgeInsets.fromLTRB(14, 14, 14, 11),
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
              Text(
                value.toCapitalize(),
                style: TextStyle(
                  fontSize: 16.5,
                  fontWeight: FontWeight.w400,
                  color: Theme.of(context).colorScheme.onBackground,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
