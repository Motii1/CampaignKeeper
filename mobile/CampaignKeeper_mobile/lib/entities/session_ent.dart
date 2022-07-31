// Entity representing a session.
import 'package:campaign_keeper_mobile/entities/base_entity.dart';

class SessionEntity implements BaseEntity {
  SessionEntity({
    required this.id,
    required this.campaignId,
    required this.name,
    required this.createdAt,
  });

  SessionEntity.fromMap(Map data) {
    id = data['id'];
    campaignId = data['campaignId'];
    name = data['name'];
    createdAt = DateTime.parse(data['createdAt']);
  }

  static const String endpoint = "/api/session/list";

  late int id;
  late int campaignId;
  late String name;
  late DateTime createdAt;

  Map<String, Object?> toMap() {
    Map<String, Object?> data = {
      "id": id,
      "campaignId": campaignId,
      "name": name,
      "createdAt": createdAt.toString(),
    };

    return data;
  }

  bool equals(Object? other) {
    if (other == null || !(other is SessionEntity)) {
      return false;
    }

    return id == other.id &&
        campaignId == other.campaignId &&
        name == other.name &&
        createdAt == other.createdAt;
  }
}
