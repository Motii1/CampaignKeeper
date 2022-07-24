abstract class BaseEntity {
  BaseEntity.decode(Map data);

  Map encode();

  bool equals(Object? other);
}
