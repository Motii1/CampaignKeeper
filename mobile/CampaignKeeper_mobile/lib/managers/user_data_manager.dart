import 'dart:convert';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/helpers/cache_helper.dart';
import 'package:campaign_keeper_mobile/managers/base_manager.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:campaign_keeper_mobile/types/http_types.dart';

class UserDataManager extends BaseManager<UserDataEntity> {
  static const String _key = "UserData";
  UserDataEntity? _entity;

  UserDataManager();

  @override
  Future<void> attach(UserDataEntity entity) async {
    await lockedOperation(
      () async {
        _entity = entity;
        Map data = _entity!.toMap();

        CacheHelper().addSecure(_key, json.encode(data));
      },
      defaultResult: null,
    );
  }

  @override
  Future<bool> patch({required UserDataEntity newEntity}) async {
    return await lockedOperation<bool>(
      () async {
        if (newEntity.imageData != null) {
          var bytes = base64Decode(newEntity.imageData!);
          var file = KeeperFile(name: 'image-file', type: KeeperMediaType.image, bytes: bytes);

          var response = await RequestHelper()
              .putFile(endpoint: UserDataEntity.imageEndpoint, file: file, isAutoLogin: false);

          if (response.status == ResponseStatus.Success) {
            _entity!.imageData = newEntity.imageData;

            notifyListeners();

            return true;
          }
        }

        return false;
      },
      defaultResult: false,
    );
  }

  @override
  UserDataEntity? get({int groupId = -1, int entId = -1}) {
    return _entity;
  }

  @override
  List<UserDataEntity> getList({int groupId = -1}) {
    return _entity == null ? [] : [_entity!];
  }

  @override
  Future<bool> refresh({EntityParameter? parameterName, int? parameterValue, bool online = true}) async {
    var refreshValue = RefreshParameter(parameter: parameterName, value: parameterValue);

    return await lockedOperation<bool>(
      () async {
        return await _refresh(parameterName: parameterName, parameterValue: parameterValue, online: online);
      },
      parameter: refreshValue,
      defaultResult: true,
    );
  }

  @override
  void clear() {
    _entity = null;
    CacheHelper().deleteSecure();
  }

  Future<bool> _refresh({EntityParameter? parameterName, int? parameterValue, bool online = true}) async {
    if (_entity == null) {
      String? cache = await CacheHelper().getSecure(_key);

      if (cache != null) {
        _entity = UserDataEntity.fromMap(json.decode(cache));
        notifyListeners();
      }
    }

    if (online) {
      Response userResponse = await RequestHelper().get(endpoint: UserDataEntity.endpoint);

      if (userResponse.status == ResponseStatus.Success && userResponse.data != null) {
        Map responseData = json.decode(userResponse.data!);

        if (_entity == null) {
          throw Exception("It's impossible to get successful response without user data.");
        } else {
          var newEntity = UserDataEntity(
            username: responseData["username"],
            email: responseData["email"],
            imageData: responseData["image"],
            password: _entity!.password,
          );

          if (!_entity!.equals(newEntity)) {
            _entity = newEntity;

            notifyListeners();

            Map data = _entity!.toMap();
            CacheHelper().addSecure(_key, json.encode(data));

            return true;
          }
        }
      } else if (userResponse.status == ResponseStatus.IncorrectData) {
        _entity = null;

        CacheHelper().deleteSecure();
        notifyListeners();
      }
    }

    return false;
  }
}
