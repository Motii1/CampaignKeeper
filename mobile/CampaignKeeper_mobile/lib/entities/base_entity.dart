abstract class BaseEntity {
  BaseEntity.fromMap(Map data);

  Map<String, Object?> toMap();

  bool equals(Object? other);
}
