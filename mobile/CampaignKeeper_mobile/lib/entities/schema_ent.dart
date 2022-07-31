import 'package:campaign_keeper_mobile/entities/base_entity.dart';
import 'package:flutter/foundation.dart';

// Entity representing a schema.
class SchemaEntity implements BaseEntity {
  SchemaEntity({
    required this.id,
    required this.campaignId,
    required this.title,
    required this.fields,
  });

  SchemaEntity.fromMap(Map data) {
    id = data['id'];
    campaignId = data['campaignId'];
    title = data['title'];
    fields = (data['fields'] as List<dynamic>).map((e) => e as String).toList();
  }

  static const String endpoint = "/api/schema/list";

  late int id;
  late int campaignId;
  late String title;
  late List<String> fields;

  Map<String, Object?> toMap() {
    Map<String, Object?> data = {
      "id": id,
      "campaignId": campaignId,
      "title": title,
      "fields": fields,
    };

    return data;
  }

  bool equals(Object? other) {
    if (other == null || !(other is SchemaEntity)) {
      return false;
    }

    return id == other.id &&
        campaignId == other.campaignId &&
        title == other.title &&
        listEquals(fields, other.fields);
  }
}
