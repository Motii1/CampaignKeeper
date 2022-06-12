import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/entities/schema_ent.dart';
import 'package:campaign_keeper_mobile/entities/session_ent.dart';
import 'package:campaign_keeper_mobile/managers/campaign_manager.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/managers/session_manager.dart';
import 'package:campaign_keeper_mobile/services/cache_util.dart';
import 'package:campaign_keeper_mobile/managers/base_manager.dart';
import 'package:campaign_keeper_mobile/managers/user_data_manager.dart';
import 'package:campaign_keeper_mobile/managers/schema_manager.dart';
import 'package:flutter/material.dart';

// Service used throught the whole app to unify
// data managment. It's implementing an interface
// very similar to the managers.
class DataCarrier {
  static final DataCarrier _dc = DataCarrier._internal();

  factory DataCarrier() {
    return _dc;
  }

  Map<Type, BaseManager> _managers = new Map();

  // Hardcoded managers initialization to the DataCarrier.
  DataCarrier._internal() {
    _managers[UserDataEntity] = new UserDataManager();
    _managers[CampaignEntity] = new CampaignManager();
    _managers[SessionEntity] = new SessionManager();
    _managers[SchemaEntity] = new SchemaManager();
  }

  void addListener<T>(VoidCallback listener) {
    if (_managers.containsKey(T)) {
      _managers[T]!.addListener(listener);
    }
  }

  void removeListener<T>(VoidCallback listener) {
    if (_managers.containsKey(T)) {
      _managers[T]!.removeListener(listener);
    }
  }

  void attach<T>(T entity) {
    if (_managers.containsKey(T)) {
      _managers[T]!.attach(entity);
    }
  }

  Future<bool> patch<T>({required T newEntity}) async {
    if (_managers.containsKey(T)) {
      return await _managers[T]!.patch(newEntity: newEntity);
    }

    return false;
  }

  T? get<T>({int entId = -1}) {
    if (_managers.containsKey(T)) {
      return _managers[T]!.get(entId: entId);
    }
    return null;
  }

  List<T> getList<T>({int groupId = -1}) {
    if (_managers.containsKey(T)) {
      return _managers[T]!.getList(groupId: groupId) as List<T>;
    }
    return [];
  }

  Future<bool> refresh<T>({int groupId = -1, bool online = true}) async {
    if (_managers.containsKey(T)) {
      return await _managers[T]!.refresh(groupId: groupId, online: online);
    }

    return false;
  }

  // This function differs as it's not clearing only
  // a specific managers data, but it's clearing
  // everything at once.
  Future<void> clear() async {
    _managers.forEach((key, value) {
      value.clear();
    });

    await CacheUtil().deleteSecure();
    await CacheUtil().delete();
  }
}
