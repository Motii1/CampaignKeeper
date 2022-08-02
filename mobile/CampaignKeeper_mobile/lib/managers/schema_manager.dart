import 'dart:convert';
import 'package:campaign_keeper_mobile/services/helpers/database_helper.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:collection/collection.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/types/http_types.dart';
import 'package:campaign_keeper_mobile/entities/schema_ent.dart';
import 'package:campaign_keeper_mobile/managers/base_manager.dart';

class SchemaManager extends BaseManager<SchemaEntity> {
  final String tableName = SchemaEntity.tableName;
  Map<int, List<SchemaEntity>> _map = {};

  @override
  Future<void> attach(SchemaEntity entity) async {
    lockedOperation(
      () async {
        _attach(entity);
        await _cacheAll();
      },
      defaultResult: null,
    );
  }

  @override
  SchemaEntity? get({int groupId = -1, int entId = -1}) {
    for (var list in _map.values) {
      var res = list.firstWhereOrNull((ent) => ent.id == entId);

      if (res != null) {
        return res;
      }
    }

    return null;
  }

  @override
  List<SchemaEntity> getList({int groupId = -1}) {
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
          _attach(SchemaEntity.fromMap(data));
        });

        notifyListeners();
      }
    }

    parameterName = parameterName ?? EntityParameter.campaign;

    if (online && parameterName == EntityParameter.campaign && parameterValue != null) {
      var parameter = RequestParameter(name: parameterName.name, value: parameterValue);
      Response userResponse = await RequestHelper().get(endpoint: SchemaEntity.endpoint, params: [parameter]);

      if (userResponse.status == ResponseStatus.Success && userResponse.data != null) {
        Map responseData = json.decode(userResponse.data!);
        List<SchemaEntity> newEntities =
            (responseData['schemas'] as List).map((e) => SchemaEntity.fromMap(e)).toList();

        if (!_isEqual(parameterValue, newEntities)) {
          _map[parameterValue] = newEntities;

          notifyListeners();
          await _cacheAll();

          return true;
        }
      } else if (userResponse.status == ResponseStatus.IncorrectData) {
        _map[parameterValue]?.clear();

        notifyListeners();
        await _cacheAll();
      }
    }

    return false;
  }

  void _attach(SchemaEntity entity) {
    int campaignId = entity.campaignId;
    if (_map[campaignId] == null) {
      _map[campaignId] = [];
    }

    _map[campaignId]!.add(entity);
  }

  bool _isEqual(int groupId, List<SchemaEntity> newEntities) {
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
    List<Map> fieldsMaps = await getValues<String>(entityTable: tableName);

    var dict = fieldsMaps.groupListsBy((e) => e['entityId']);

    entMaps.forEach((ent) {
      var newEntity = Map.from(ent);
      var fields = (dict[ent['id']] ?? []).map((e) => e['value'] as String).toList();

      newEntity['fields'] = fields;
      resMaps.add(newEntity);
    });

    return resMaps;
  }

  Future<void> _cacheAll() async {
    var database = DatabaseHelper();
    var campaigns = DataCarrier().getList<CampaignEntity>().map((e) => e.id).toList();

    List<SchemaEntity> entities = [];

    _map.forEach((key, value) {
      if (campaigns.contains(key) || campaigns.isEmpty) {
        entities.addAll(value);
      }
    });

    List<Map<String, Object>> fieldsMaps = [];

    entities.forEach((e) {
      var fields = listToValueMaps(e.fields, entityId: e.id, entityTable: tableName);

      if (fields.isNotEmpty) {
        fieldsMaps.addAll(fields);
      }
    });

    var entitiesMaps = entities.map((e) {
      var map = e.toMap();
      map.remove('fields');

      return map;
    }).toList();

    await Future.wait([
      database.delete(tableName),
      database.delete('strings', where: 'entityTable = ?', whereArgs: [tableName]),
    ]);
    await Future.wait([
      database.insertList(tableName, entitiesMaps),
      database.insertList('strings', fieldsMaps),
    ]);
  }
}
