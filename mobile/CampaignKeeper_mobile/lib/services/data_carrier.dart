import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/services/managers/campaign_manager.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/cache_util.dart';
import 'package:campaign_keeper_mobile/services/managers/base_manager.dart';
import 'package:campaign_keeper_mobile/services/managers/user_data_manager.dart';
import 'package:flutter/material.dart';

class DataCarrier {
  static final DataCarrier _dc = DataCarrier._internal();

  factory DataCarrier() {
    return _dc;
  }

  Map<Type, BaseManager> _managers = new Map();

  // Adding managers
  DataCarrier._internal() {
    _managers[UserDataEntity] = new UserDataManager();
    _managers[CampaignEntity] = new CampaignManager();
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

  Future<bool> update<T>({int entId = -1, Object? data}) async {
    if (_managers.containsKey(T)) {
      return await _managers[T]!.update(entId: entId, data: data);
    }

    return false;
  }

  T? get<T>({int entId = -1}) {
    if (_managers.containsKey(T)) {
      return _managers[T]!.get(entId: entId);
    }
    return null;
  }

  List<T> getList<T>() {
    if (_managers.containsKey(T)) {
      return _managers[T]!.getList() as List<T>;
    }
    return [];
  }

  Future<bool> refresh<T>({int groupId = -1, bool online = true}) async {
    if (_managers.containsKey(T)) {
      return await _managers[T]!.refresh(groupId: groupId, online: online);
    }

    return false;
  }

  Future<void> clear() async {
    _managers.forEach((key, value) {
      value.clear();
    });

    await CacheUtil().deleteSecure();
    await CacheUtil().delete();
  }
}
