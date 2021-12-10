import 'dart:typed_data';
import 'dart:convert';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/cache_util.dart';
import 'package:campaign_keeper_mobile/services/managers/base_manager.dart';
import 'package:campaign_keeper_mobile/services/request_helper.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';

class UserDataManager implements BaseManager<UserDataEntity> {
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

  // TODO: use get from request helper here
  @override
  Future<bool> refresh({int groupId = -1}) async {
    if (_entity == null) {
      String? data = await CacheUtil().get(_key);
      if (data != null) {
        _entity = _createEntity(json.decode(data));
      }
    }

    Response userResponse = await RequestHelper().get(UserDataEntity.imageEndpoint);
    switch(userResponse.status) {
      case ResponseStatus.Success:
        UserDataEntity userData = new UserDataEntity(userResponse.dataBytes);
        if (_entity == null || _entity != userData) {
          _entity = userData;
          return true;
        }

        break;
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

  UserDataEntity? _createEntity(Map data) {
    if (data.isNotEmpty) {
      Uint8List imageData = data["imageData"];

      return new UserDataEntity(imageData);
    }

    return null;
  }
}
