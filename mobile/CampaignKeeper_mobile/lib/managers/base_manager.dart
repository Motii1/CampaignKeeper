import 'package:flutter/material.dart';

// A hollow class used as a base for proper managers
// due to a lack of interfaces in dart.
class BaseManager<T> extends ChangeNotifier {
  // Attaches given entity to the local base and caches it.
  // Might also update server.
  void attach(T entity) {
    throw new UnimplementedError();
  }

  // Used to patch entities.
  Future<bool> patch({required T newEntity}) async {
    throw new UnimplementedError();
  }

  // Used to get specific entity.
  T? get({int entId = -1}) {
    throw new UnimplementedError();
  }

  // Used to get a list of entities.
  // Optional argument can be used to retrieve
  // a specific type of entities.
  List<T> getList({int groupId = -1}) {
    throw new UnimplementedError();
  }

  // Used to refresh entities from local cache
  // or from a server.
  Future<bool> refresh({int groupId = -1, bool online = true}) {
    throw new UnimplementedError();
  }

  // Used to clear data.
  void clear() {
    throw new UnimplementedError();
  }
}
