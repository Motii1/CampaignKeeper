// Enum representing if a FieldValue is a plain text
// or a link to another object.
enum FieldValueType {
  Text,
  Id,
}

// Class representing part of an objects field.
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

  static Map<String, Object> encode(FieldValue value) {
    var data = {
      'type': value.type == FieldValueType.Text ? "string" : "id",
      'sequenceNumber': value.sequence,
      'value': value.type == FieldValueType.Text ? value.text : value.id,
      'fieldName': value.fieldName,
    };

    return data;
  }

  static FieldValue decode(Map data, {defaultFieldName = ""}) {
    if (!data.containsKey('type') || !data.containsKey('sequenceNumber') || !data.containsKey('value')) {
      throw Exception("Wrong FieldValue data map.");
    }

    FieldValueType type = data['type'] == "string" ? FieldValueType.Text : FieldValueType.Id;
    int sequence = data['sequenceNumber'];
    String text = type == FieldValueType.Text ? data['value'] : "";
    int id = type == FieldValueType.Id ? int.parse(data['value'].toString()) : 0;
    String fieldName = data['fieldName'] ?? defaultFieldName;

    if (type == FieldValueType.Text) {
      return FieldValue(type: type, sequence: sequence, fieldName: fieldName, text: text);
    } else {
      return FieldValue(type: type, sequence: sequence, fieldName: fieldName, id: id);
    }
  }
}

// Used by KeeperSliverReplacer to determine if
// a change should or shouldn't be animated.
enum KeeperSliverReplacerType {
  Animate,
  Instant,
}

// Used for proper endpoints selection.
enum EntityParameter {
  campaign,
  schema,
  session,
}

// Extends EntityParameter with a method
// to get string value out of enum.
extension EntityParameterExtension on EntityParameter {
  String get name {
    switch (this) {
      case EntityParameter.campaign:
        return 'campaignId';
      case EntityParameter.schema:
        return 'schemaId';
      case EntityParameter.session:
        return 'sessionId';
    }
  }
}

// Extends lists of FieldValue with an easy option
// of equality check.
extension ListFieldValueExtension on List<FieldValue> {
  bool equals(List<FieldValue> other) {
    if (this.length != other.length) {
      return false;
    }

    for (int i = 0; i < this.length; i++) {
      if (!this[i].equals(other[i])) {
        return false;
      }
    }

    return true;
  }
}

// Represents manager refresh options.
class RefreshParameter {
  final EntityParameter? parameter;
  final int? value;

  RefreshParameter({this.parameter, this.value});

  bool equals(RefreshParameter? other) {
    if (other == null) return false;

    return parameter == other.parameter && value == other.value;
  }
}

class Tuple<T1, T2> {
  T1 first;
  T2 second;

  Tuple({required this.first, required this.second});
}

// Extends lists of ints with an easy option
// of equality check.
extension ListIntExtension on List<int> {
  bool equals(List<int> other) {
    if (this.length != other.length) {
      return false;
    }

    for (int i = 0; i < this.length; i++) {
      if (this[i] != other[i]) {
        return false;
      }
    }

    return true;
  }
}

// Extends strings with the ability to
//capitalize every word (separated by space) in it.
extension StringExtension on String {
  String toCapitalize() {
    var words = this.split(" ");
    var builder = StringBuffer();

    words.forEach((word) {
      var tmp = word[0].toUpperCase();

      if (word.length > 1) {
        tmp += word.substring(1);
      }

      builder.write(tmp);
    });

    return builder.toString();
  }
}
