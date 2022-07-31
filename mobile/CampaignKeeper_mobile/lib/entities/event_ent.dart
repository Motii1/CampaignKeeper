import 'package:campaign_keeper_mobile/entities/base_entity.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';

// Entity representing an event.
class EventEntity implements BaseEntity {
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

  EventEntity.fromMap(Map data) {
    id = data['id'];
    sessionId = data['sessionId'];
    title = data['title'];
    type = data['type'];
    status = data['status'];
    displayStatus = data['displayStatus'];
    characterValues = (data['charactersMetadataArray'] as List<dynamic>)
        .map((e) => FieldValue.decode(e, defaultFieldName: 'characters'))
        .toList();
    placeValues = (data['placeMetadataArray'] as List<dynamic>)
        .map((e) => FieldValue.decode(e, defaultFieldName: 'places'))
        .toList();
    descriptionValues = (data['descriptionMetadataArray'] as List<dynamic>)
        .map((e) => FieldValue.decode(e, defaultFieldName: 'descriptions'))
        .toList();
    parentIds = (data['parentIds'] as List<dynamic>).map((e) => e as int).toList();
    childrenIds = (data['childrenIds'] as List<dynamic>).map((e) => e as int).toList();
  }

  static const String endpoint = '/api/event/graph';

  late int id;
  late int sessionId;
  late String title;
  late String type;
  late String status;
  late String displayStatus;
  late List<FieldValue> characterValues;
  late List<FieldValue> placeValues;
  late List<FieldValue> descriptionValues;
  late List<int> parentIds;
  late List<int> childrenIds;

  bool get isFight => type.toLowerCase() == 'fight';

  bool get isShown => displayStatus.toLowerCase() == 'shown';

  bool get isOmitted => status.toLowerCase() == 'omitted';

  Map toMap() {
    Map data = {
      'id': id,
      'sessionId': sessionId,
      'title': title,
      'type': type,
      'status': status,
      'displayStatus': displayStatus,
      'charactersMetadataArray': characterValues.map((e) => FieldValue.encode(e)).toList(),
      'placeMetadataArray': placeValues.map((e) => FieldValue.encode(e)).toList(),
      'descriptionMetadataArray': descriptionValues.map((e) => FieldValue.encode(e)).toList(),
      'parentIds': parentIds,
      'childrenIds': childrenIds,
    };

    return data;
  }

  bool equals(Object? other) {
    if (other == null || !(other is EventEntity)) {
      return false;
    }

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
