import 'package:flutter/material.dart';

// Controller used by search page to properly filter
// searched data and display it on screen.
class BaseSearchController<T> {
  final String heroTag;

  const BaseSearchController({required this.heroTag});

  // Returns filtered list of entities.
  List filterEntities(String input) {
    throw UnimplementedError();
  }

  // Builds a widget for the given entity.
  Widget createWidget(BuildContext context, Object entity) {
    throw UnimplementedError();
  }
}
