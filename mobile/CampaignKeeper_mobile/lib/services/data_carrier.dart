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

  void attach<T>(T entity) {
    if (_managers.containsKey(T)) {
      _managers[T]!.attach(entity);
    }
  }

  T? getEntity<T>({int entId = -1}) {
    if (_managers.containsKey(T)) {
      return _managers[T]!.getEntity(entId: entId);
    }
    return null;
  }

  List<T> getEntities<T>() {
    if (_managers.containsKey(T)) {
      return _managers[T]!.getEntities() as List<T>;
    }
    return [];
  }

  Future<bool> refresh<T>({int groupId = -1}) async {
    if (_managers.containsKey(T)) {
      return await _managers[T]!.refresh(groupId: groupId);
    }

    return false;
  }

  Future<void> deleteCache() async {
    await CacheUtil().deleteSecure();
    await CacheUtil().delete();
  }
}
