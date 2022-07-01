import 'package:campaign_keeper_mobile/types/entity_types.dart';

class EventEntity {
  static const String endpoint = '/api/event/graph';

  int id;
  int sessionId;
  String title;
  String type;
  String status;
  String displayStatus;
  List<FieldValue> characterValues;
  List<FieldValue> placeValues;
  List<FieldValue> descriptionValues;
  List<int> parentIds;
  List<int> childrenIds;

  EventEntity({
    required this.id,
    required this.sessionId,
    required this.title,
    required this.type,
    required this.status,
    required this.displayStatus,
    required this.characterValues,
    required this.placeValues,
    required this.descriptionValues,
    required this.parentIds,
    required this.childrenIds,
  });

  bool equals(EventEntity other) {
    return id == other.id &&
        sessionId == other.sessionId &&
        title == other.title &&
        type == other.type &&
        status == other.status &&
        displayStatus == other.displayStatus &&
        parentIds.equals(other.parentIds) &&
        childrenIds.equals(other.childrenIds) &&
        characterValues.equals(other.characterValues) &&
        placeValues.equals(other.placeValues) &&
        descriptionValues.equals(other.descriptionValues);
  }
}
