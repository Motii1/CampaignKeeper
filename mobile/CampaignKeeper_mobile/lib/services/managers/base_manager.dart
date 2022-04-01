import 'package:flutter/material.dart';

class BaseManager<T> extends ChangeNotifier {
  // Data locations: cache, ram, server

  // Attaches given entity to the local base and cache it
  // If ever this app would save new data then it should also update server database
  void attach(T entity) {
    throw new UnimplementedError();
  }

  T? getEntity({int entId = -1}) {
    throw new UnimplementedError();
  }

  List<T> getEntities() {
    throw new UnimplementedError();
  }

  // Should be debated about caching all vs specified data
  // Get all data from cache, then try to download new, specified one
  // Compare data and if there are differences call notifyListeners() and return true
  // Else return false
  Future<bool> refresh({int groupId = -1, bool online = true}) {
    throw new UnimplementedError();
  }

  void clear() {
    throw new UnimplementedError();
  }
}
