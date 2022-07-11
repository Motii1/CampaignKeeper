import 'dart:async';

import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/material.dart';

// A hollow class used as a base for proper managers
// due to a lack of interfaces in dart.
class BaseManager<T> extends ChangeNotifier {
  Future? lock;
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
  Future<bool> refresh({EntityParameter? parameterName, int? parameterValue, bool online = true}) {
    throw new UnimplementedError();
  }

  // Used to clear data.
  void clear() {
    throw new UnimplementedError();
  }

  Future<bool> lockOperation(Completer completer, {RefreshParameter? parameter}) async {
    if (lock != null) {
      dynamic res = await lock;
      if (parameter != null && res != null && res is RefreshParameter) {
        if (res.equals(parameter)) {
          return true;
        }
      }
    }

    lock = completer.future;

    return false;
  }

  void releaseOperation(Completer completer, {RefreshParameter? parameter}) {
    completer.complete(parameter);
    lock = null;
  }

  Future<T> lockedOperation<T>(Future<T> fun(),
      {required T defaultResult, RefreshParameter? parameter}) async {
    var completer = Completer();
    bool lockRes = await lockOperation(completer, parameter: parameter);

    if (lockRes) {
      return defaultResult;
    }

    T res = await fun();

    releaseOperation(completer, parameter: parameter);

    return res;
  }
}
