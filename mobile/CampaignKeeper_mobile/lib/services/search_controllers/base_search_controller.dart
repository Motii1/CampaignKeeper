import 'package:flutter/material.dart';

class BaseSearchController<T> {
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
