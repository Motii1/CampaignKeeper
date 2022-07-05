import 'package:flutter/material.dart';

class BaseSearchController<T> {
  final String heroTag;

  const BaseSearchController({required this.heroTag});

  Type getEntityType() {
    return T;
  }

  List filterEntities(String input) {
    throw UnimplementedError();
  }

  Widget createWidget(BuildContext context, Object entity) {
    throw UnimplementedError();
  }
}
