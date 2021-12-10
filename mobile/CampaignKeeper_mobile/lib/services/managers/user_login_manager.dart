import 'package:campaign_keeper_mobile/entities/user_login_ent.dart';
import 'package:campaign_keeper_mobile/services/cache_util.dart';
import 'package:campaign_keeper_mobile/services/managers/base_manager.dart';
import 'dart:convert';

class UserLoginManager implements BaseManager<UserLoginEntity> {
  static const List _fields = ["name", "email", "password"];
  static const String _key = "UserLogin";
  UserLoginEntity? _entity;

  UserLoginManager();

  @override
  void attach(UserLoginEntity entity) {
    _entity = entity;
    Map? data = _mapEntity();

    if (data != null) {
      CacheUtil().addSecure(_key, json.encode(data));
    }
  }

  @override
  UserLoginEntity? getEntity({int groupId = -1, int entId = -1}) {
    return _entity;
  }

  @override
  List<UserLoginEntity> getEntities({int groupId = -1}) {
    List<UserLoginEntity> entities = [];

    if (_entity != null) {
      entities.add(_entity!);
    }

    return entities;
  }

  @override
  Future<bool> refresh({int groupId = -1}) async {
    if (_entity == null) {
      String? data = await CacheUtil().getSecure(_key);

      if (data != null) {
        _entity = _createEntity(json.decode(data));
      }
    }

    return false;
  }

  Map? _mapEntity() {
    if (_entity != null) {
      Map data = {
        "name": _entity!.name,
        "email": _entity!.email,
        "password": _entity!.password,
      };

      return data;
    }

    return null;
  }

  UserLoginEntity? _createEntity(Map data) {
    if (data.isNotEmpty) {
      bool isDataMissing = false;

      _fields.forEach((element) {
        isDataMissing |= data[element] == null;
      });

      if (isDataMissing) {
        print("Data is incorrect");
        return null;
      }

      String name = data["name"];
      String email = data["email"];
      String password = data["password"];

      return new UserLoginEntity(
          name: name,
          email: email,
          password: password,);
    }

    return null;
  }
}
