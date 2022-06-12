import 'package:flutter/foundation.dart';

class SchemaEntity {
  static const String endpoint = "/api/schema/list";

  int id;
  int campaignId;
  String title;
  List<String> fields;

  SchemaEntity({
    required this.id,
    required this.campaignId,
    required this.title,
    required this.fields,
  });

  bool equals(SchemaEntity other) {
    return id == other.id &&
        campaignId == other.campaignId &&
        title == other.title &&
        listEquals(fields, other.fields);
  }
}
