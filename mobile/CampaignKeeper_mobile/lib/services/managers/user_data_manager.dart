import 'dart:convert';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/cache_util.dart';
import 'package:campaign_keeper_mobile/services/managers/base_manager.dart';
import 'package:campaign_keeper_mobile/services/request_helper.dart';

class UserDataManager extends BaseManager<UserDataEntity> {
  static const String _key = "UserData";
  UserDataEntity? _entity;

  UserDataManager();

  @override
  void attach(UserDataEntity entity) {
    _entity = entity;
    Map? data = _mapEntity();

    if (data != null) {
      CacheUtil().add(_key, json.encode(data));
    }
  }

  @override
  UserDataEntity? getEntity({int groupId = -1, int entId = -1}) {
    return _entity;
  }

  @override
  List<UserDataEntity> getEntities({int groupId = -1}) {
    List<UserDataEntity> entities = [];

    if (_entity != null) {
      entities.add(_entity!);
    }

    return entities;
  }

  @override
  Future<bool> refresh({int groupId = -1}) async {
    UserDataEntity userData = new UserDataEntity();
    if (_entity == null) {
      _entity = userData;
      String? data = await CacheUtil().get(_key);
      if (data != null) {
        _entity!.imageData = json.decode(data);
      }
    }

    Response userResponse = await RequestHelper().get(UserDataEntity.endpoint);
    if (userResponse.status == ResponseStatus.Success &&
        _entity!.imageData != userResponse.dataBytes) {
      _entity!.imageData = userResponse.dataBytes;
      notifyListeners();

      return true;
    }

    return false;
  }

  Map? _mapEntity() {
    if (_entity != null) {
      Map data = {
        "imageData": _entity!.imageData,
      };

      return data;
    }

    return null;
  }
}
