import 'package:campaign_keeper_mobile/entities/user_login_ent.dart';
import 'package:campaign_keeper_mobile/services/managers/base_manager.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';

class UserLoginManager implements BaseManager<UserLoginEntity> {
  final FlutterSecureStorage _storage = new FlutterSecureStorage();
  static const List _fields = ["name", "email", "password"];
  UserLoginEntity? _entity;

  UserLoginManager();

  @override
  void attach(UserLoginEntity entity) {
    _entity = entity;
    _cacheAll();
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
  Future<int> refresh({int groupId = -1}) async {
    if (_entity == null) {
      // try load from cache
      Map data = await _readFromCache();
      _entity = _createEntity(data);
    }

    return 0;
  }

  // TODO: create cache_util and replace this function with it
  Future<void> _cacheAll() async {
    await _storage.deleteAll();

    if (_entity != null) {
      Map data = {
        "name": _entity!.name,
        "email": _entity!.email,
        "password": _entity!.password,
      };

      await _storage.write(key: "UserData", value: json.encode(data));
    }
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

  Future<Map> _readFromCache() async {
    String? cachedData = await _storage.read(key: "UserData");
    if (cachedData != null) {
      return jsonDecode(cachedData);
    }

    return new Map();
  }
}
