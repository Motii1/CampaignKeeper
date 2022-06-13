import 'package:flutter/material.dart';

class BaseSearchController<T> {
  final String heroTag;

  BaseSearchController({required this.heroTag});

  Type getEntityType() {
    return T;
  }

  List filterEntities(String input) {
    throw UnimplementedError();
  }

  Widget createWidget(Object entity) {
    throw UnimplementedError();
  }
}
