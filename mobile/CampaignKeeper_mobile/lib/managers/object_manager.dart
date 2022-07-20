import 'dart:convert';
import 'package:collection/collection.dart';
import 'package:campaign_keeper_mobile/entities/object_ent.dart';
import 'package:campaign_keeper_mobile/entities/schema_ent.dart';
import 'package:campaign_keeper_mobile/managers/base_manager.dart';
import 'package:campaign_keeper_mobile/services/cache_util.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:campaign_keeper_mobile/types/http_types.dart';

class ObjectManager extends BaseManager<ObjectEntity> {
  static const String _key = "Object";
  Map<int, List<ObjectEntity>> _map = {};

  @override
  Future<void> attach(ObjectEntity entity) async {
    lockedOperation(
      () async {
        _attach(entity);
        await _cacheAll();
      },
      defaultResult: null,
    );
  }

  @override
  ObjectEntity? get({int groupId = -1, int entId = -1}) {
    for (var list in _map.values) {
      var res = list.firstWhereOrNull((ent) => ent.id == entId);

      if (res != null) {
        return res;
      }
    }

    return null;
  }

  @override
  List<ObjectEntity> getList({int groupId = -1}) {
    var list = _map[groupId];

    return list ?? [];
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
    _map.clear();
    _cacheAll();
  }

  Future<bool> _refresh({EntityParameter? parameterName, int? parameterValue, bool online = true}) async {
    if (_map.isEmpty) {
      String? cache = await CacheUtil().get(_key);
      if (cache != null) {
        List cacheData = json.decode(cache);
        cacheData.forEach((data) {
          _attach(ObjectEntity.decode(data));
        });

        notifyListeners();
      }
    }

    parameterName = parameterName ?? EntityParameter.schema;

    if (online && parameterValue != null) {
      var parameter = RequestParameter(name: parameterName.name, value: parameterValue);
      Response userResponse = await RequestHelper().get(endpoint: ObjectEntity.endpoint, params: [parameter]);

      if (userResponse.status == ResponseStatus.Success && userResponse.data != null) {
        Map responseData = json.decode(userResponse.data!);
        List<ObjectEntity> newEntities =
            (responseData['objects'] as List).map((e) => ObjectEntity.decode(e)).toList();

        if (parameterName == EntityParameter.schema && !_isEqual(parameterValue, newEntities)) {
          if (_isEqual(parameterValue, newEntities)) {
            return false;
          }

          _map[parameterValue] = newEntities;
        } else {
          var oldKeys = _map.keys.toList();
          var newKeys = newEntities.map((e) => e.schemaId).toSet();
          bool isEqual = newKeys.toList().equals(oldKeys);
          int iter = 0;

          while (isEqual && iter < oldKeys.length) {
            var key = oldKeys[iter];
            isEqual &= _isEqual(key, newEntities.where((e) => e.schemaId == key).toList());

            iter++;
          }

          if (isEqual) {
            return false;
          }

          _map.clear();

          newKeys.forEach((key) {
            _map[key] = newEntities.where((e) => e.schemaId == key).toList();
          });
        }

        notifyListeners();
        await _cacheAll();

        return true;
      } else if (userResponse.status == ResponseStatus.IncorrectData) {
        if (parameterName == EntityParameter.schema) {
          _map[parameterValue]?.clear();
        } else {
          _map.clear();
        }

        notifyListeners();
        await _cacheAll();
      }
    }

    return false;
  }

  void _attach(ObjectEntity entity) {
    int schemaId = entity.schemaId;
    if (_map[schemaId] == null) {
      _map[schemaId] = [];
    }

    _map[schemaId]!.add(entity);
  }

  bool _isEqual(int groupId, List<ObjectEntity> newEntities) {
    if (newEntities.length != _map[groupId]?.length) {
      return false;
    }

    for (int i = 0; i < newEntities.length; i++) {
      if (!newEntities[i].equals(_map[groupId]![i])) {
        return false;
      }
    }

    return true;
  }

  Future<void> _cacheAll() async {
    var schemas = DataCarrier().getList<SchemaEntity>().map((e) => e.id).toList();
    var data = [];

    _map.forEach(
      (key, list) {
        if (schemas.isEmpty || schemas.contains(key)) {
          data.addAll(list.map((e) => e.encode()));
        }
      },
    );

    CacheUtil().add(_key, json.encode(data));
  }
}
