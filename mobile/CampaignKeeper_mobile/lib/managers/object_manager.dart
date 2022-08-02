import 'dart:convert';
import 'package:campaign_keeper_mobile/services/helpers/database_helper.dart';
import 'package:collection/collection.dart';
import 'package:campaign_keeper_mobile/entities/object_ent.dart';
import 'package:campaign_keeper_mobile/entities/schema_ent.dart';
import 'package:campaign_keeper_mobile/managers/base_manager.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:campaign_keeper_mobile/types/http_types.dart';

class ObjectManager extends BaseManager<ObjectEntity> {
  final String tableName = ObjectEntity.tableName;
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
      var cache = await _getCache();
      if (cache.isNotEmpty) {
        cache.forEach((data) {
          _attach(ObjectEntity.fromMap(data));
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
            (responseData['objects'] as List).map((e) => ObjectEntity.fromMap(e)).toList();

        if (parameterName == EntityParameter.schema) {
          if (_isEqual(parameterValue, newEntities)) {
            return false;
          }

          _map[parameterValue] = newEntities;
        } else if (parameterName == EntityParameter.campaign) {
          var oldSchemaIds =
              DataCarrier().getList<SchemaEntity>(groupId: parameterValue).map((e) => e.id).toSet().toList();
          var newSchemaIds = newEntities.map((e) => e.schemaId).toSet();
          bool isEqual = false;

          if (oldSchemaIds.isNotEmpty) {
            isEqual = true;

            for (int id in oldSchemaIds) {
              if (!newSchemaIds.contains(id)) {
                isEqual = false;
                _map.remove(id);
              }
            }
          }

          int iter = 0;

          while (isEqual && iter < oldSchemaIds.length) {
            var key = oldSchemaIds[iter];
            isEqual &= _isEqual(key, newEntities.where((e) => e.schemaId == key).toList());

            iter++;
          }

          if (isEqual) {
            return false;
          }

          newSchemaIds.forEach((id) {
            _map[id] = newEntities.where((e) => e.schemaId == id).toList();
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

  Future<List<Map>> _getCache() async {
    List<Map> resMaps = [];
    List<Map> entMaps = await getListFromDb(tableName);
    List<Map> fieldsMaps = await getListFromDb(
      FieldValue.tableName,
      where: 'entityTable = ?',
      whereArgs: [tableName],
    );

    var fieldsDict = fieldsMaps.groupListsBy((e) => e['entityId']);

    entMaps.forEach((ent) {
      var newEntity = Map.from(ent);

      var fields = fieldsDict[ent['id']] ?? [];

      newEntity['metadataArray'] = fields;

      resMaps.add(newEntity);
    });

    return resMaps;
  }

  Future<void> _cacheAll() async {
    var database = DatabaseHelper();
    var schemas = DataCarrier().getList<SchemaEntity>().map((e) => e.id).toList();

    List<ObjectEntity> entities = [];

    _map.forEach((key, value) {
      if (schemas.contains(key) || schemas.isEmpty) {
        entities.addAll(value);
      }
    });

    List<Map<String, Object>> fieldsMaps = [];

    entities.forEach((e) {
      var fields = e.values.map((f) => f.toMap(entityTable: tableName, entityId: e.id, entityType: ''));

      fieldsMaps.addAll(fields);
    });

    var entitiesMaps = entities.map((e) {
      var map = e.toMap();
      map.remove('metadataArray');

      return map;
    }).toList();

    await Future.wait([
      database.delete(tableName),
      database.delete(FieldValue.tableName, where: 'entityTable = ?', whereArgs: [tableName]),
    ]);
    await Future.wait([
      database.insertList(tableName, entitiesMaps),
      database.insertList(FieldValue.tableName, fieldsMaps),
    ]);
  }
}
