abstract class BaseEntity {
  BaseEntity.fromMap(Map data);

  Map toMap();

  bool equals(Object? other);
}
