import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_login_ent.dart';
import 'package:campaign_keeper_mobile/services/cache_util.dart';
import 'package:campaign_keeper_mobile/services/managers/base_manager.dart';
import 'package:campaign_keeper_mobile/services/managers/user_login_manager.dart';
import 'package:campaign_keeper_mobile/services/managers/user_data_manager.dart';

class DataCarrier {
  static final DataCarrier _dc = DataCarrier._internal();

  factory DataCarrier() {
    return _dc;
  }

  Map<Type, BaseManager> _managers = new Map();

  // Adding managers
  DataCarrier._internal() {
    _managers[UserLoginEntity] = new UserLoginManager();
    _managers[UserDataEntity] = new UserDataManager();
  }

  void attach<T>(T entity)
  {
    if (_managers.containsKey(T)) {
      _managers[T]!.attach(entity);
    }
  }

  T? getEntity<T>({int groupId = -1, int entId = -1}) {
    if (_managers.containsKey(T)) {
      return _managers[T]!.getEntity(groupId: groupId, entId: entId);
    }
    return null;
  }

  List getEntities<T>({int groupId = -1}) {
    if (_managers.containsKey(T)) {
      return _managers[T]!.getEntities(groupId: groupId);
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
