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
      "type": value.type == FieldValueType.Text ? "text" : "id",
      "sequenceNumber": value.sequence,
      "value": value.type == FieldValueType.Text ? value.text : value.id,
      "fieldName": value.fieldName,
    };

    return data;
  }

  static FieldValue decode(Map data) {
    if (!data.containsKey("type") ||
        !data.containsKey("sequenceNumber") ||
        !data.containsKey("value") ||
        !data.containsKey("fieldName")) {
      throw Exception("Wrong FieldValue data map.");
    }

    var type = data["type"] == "text" ? FieldValueType.Text : FieldValueType.Id;
    var sequence = data["sequenceNumber"];
    var text = type == FieldValueType.Text ? data["value"] : "";
    var id = type == FieldValueType.Id ? data["value"] : 0;
    var fieldName = data["fieldName"];

    if (type == FieldValueType.Text) {
      return FieldValue(type: type, sequence: sequence, fieldName: fieldName, text: text);
    } else {
      return FieldValue(type: type, sequence: sequence, fieldName: fieldName, id: id);
    }
  }
}
