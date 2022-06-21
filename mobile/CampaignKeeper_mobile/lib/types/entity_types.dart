enum FieldValueType {
  Text,
  Id,
}

class FieldValue {
  FieldValueType type;
  int sequence;
  String text;
  int id;
  String fieldName;

  FieldValue(
      {required this.type, required this.sequence, this.text = "", this.id = 0, required this.fieldName});

  bool equals(FieldValue other) {
    return type == other.type &&
        sequence == other.sequence &&
        text == other.text &&
        id == other.id &&
        fieldName == fieldName;
  }

  static Map encode(FieldValue value) {
    var data = {
      'type': value.type == FieldValueType.Text ? "string" : "id",
      'sequenceNumber': value.sequence,
      'value': value.type == FieldValueType.Text ? value.text : value.id,
      'fieldName': value.fieldName,
    };

    return data;
  }

  static FieldValue decode(Map data) {
    if (!data.containsKey('type') ||
        !data.containsKey('sequenceNumber') ||
        !data.containsKey('value') ||
        !data.containsKey('fieldName')) {
      throw Exception("Wrong FieldValue data map.");
    }

    FieldValueType type = data['type'] == "string" ? FieldValueType.Text : FieldValueType.Id;
    int sequence = data['sequenceNumber'];
    String text = type == FieldValueType.Text ? data['value'] : "";
    int id = type == FieldValueType.Id ? int.parse(data['value'].toString()) : 0;
    String fieldName = data['fieldName'];

    if (type == FieldValueType.Text) {
      return FieldValue(type: type, sequence: sequence, fieldName: fieldName, text: text);
    } else {
      return FieldValue(type: type, sequence: sequence, fieldName: fieldName, id: id);
    }
  }
}

enum KeeperSliverReplacerType {
  Animate,
  Instant,
}
