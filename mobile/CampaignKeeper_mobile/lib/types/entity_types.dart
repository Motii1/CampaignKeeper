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
}
