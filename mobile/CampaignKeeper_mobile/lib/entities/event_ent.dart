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
  });

  bool equals(EventEntity other) {
    bool characterEquals = characterValues.equals(other.characterValues);
    bool placesEquals = placeValues.equals(other.placeValues);
    bool descriptionEquals = descriptionValues.equals(other.descriptionValues);

    return characterEquals &&
        placesEquals &&
        descriptionEquals &&
        id == other.id &&
        sessionId == other.sessionId &&
        title == other.title &&
        type == other.type &&
        status == other.status &&
        displayStatus == other.displayStatus;
  }
}
