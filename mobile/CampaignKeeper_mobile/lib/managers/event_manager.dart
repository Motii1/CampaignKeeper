import 'dart:convert';
import 'package:campaign_keeper_mobile/entities/event_ent.dart';
import 'package:campaign_keeper_mobile/entities/session_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/database_helper.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:campaign_keeper_mobile/types/http_types.dart';
import 'package:collection/collection.dart';
import 'package:campaign_keeper_mobile/managers/base_manager.dart';

class EventManager extends BaseManager<EventEntity> {
  final String tableName = EventEntity.tableName;
  Map<int, List<EventEntity>> _map = {};

  @override
  Future<void> attach(EventEntity entity) async {
    lockedOperation<void>(
      () async {
        _attach(entity);
        await _cacheAll();
      },
      defaultResult: null,
    );
  }

  @override
  EventEntity? get({int groupId = -1, int entId = -1}) {
    for (var list in _map.values) {
      var res = list.firstWhereOrNull((ent) => ent.id == entId);

      if (res != null) {
        return res;
      }
    }

    return null;
  }

  @override
  List<EventEntity> getList({int groupId = -1}) {
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
          _attach(EventEntity.fromMap(data));
        });

        notifyListeners();
      }
    }

    parameterName = parameterName ?? EntityParameter.session;

    if (online && parameterName == EntityParameter.session && parameterValue != null) {
      var parameter = RequestParameter(value: parameterValue);
      Response userResponse = await RequestHelper().get(endpoint: EventEntity.endpoint, params: [parameter]);

      if (userResponse.status == ResponseStatus.Success && userResponse.data != null) {
        Map responseData = json.decode(userResponse.data!);
        List<EventEntity> newEntities =
            (responseData['events'] as List).map((e) => EventEntity.fromMap(e)).toList();

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

  void _attach(EventEntity entity) {
    int sessionId = entity.sessionId;
    if (_map[sessionId] == null) {
      _map[sessionId] = [];
    }

    _map[sessionId]!.add(entity);
  }

  bool _isEqual(int groupId, List<EventEntity> newEntities) {
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
    List<Map> charactersMaps = await getListFromDb(
      FieldValue.tableName,
      where: 'entityTable = ? and entityType = ?',
      whereArgs: [tableName, 'characters'],
    );
    List<Map> placesMaps = await getListFromDb(
      FieldValue.tableName,
      where: 'entityTable = ? and entityType = ?',
      whereArgs: [tableName, 'places'],
    );
    List<Map> descriptionMaps = await getListFromDb(
      FieldValue.tableName,
      where: 'entityTable = ? and entityType = ?',
      whereArgs: [tableName, 'description'],
    );
    List<Map> parentsMaps =
        await DatabaseHelper().getValues<int>(entityTable: tableName, entityType: 'parents');
    List<Map> childrenMaps =
        await DatabaseHelper().getValues<int>(entityTable: tableName, entityType: 'children');

    var characterDict = charactersMaps.groupListsBy((e) => e['entityId']);
    var placesDict = placesMaps.groupListsBy((e) => e['entityId']);
    var descriptionDict = descriptionMaps.groupListsBy((e) => e['entityId']);
    var parentsDict = parentsMaps.groupListsBy((e) => e['entityId']);
    var childrenDict = childrenMaps.groupListsBy((e) => e['entityId']);

    entMaps.forEach((ent) {
      var newEntity = Map.from(ent);

      var characters = characterDict[ent['id']] ?? [];
      var places = placesDict[ent['id']] ?? [];
      var description = descriptionDict[ent['id']] ?? [];

      var parents = (parentsDict[ent['id']] ?? []).map((e) => e['value'] as int).toList();
      var children = (childrenDict[ent['id']] ?? []).map((e) => e['value'] as int).toList();

      newEntity['charactersMetadataArray'] = characters;
      newEntity['placeMetadataArray'] = places;
      newEntity['descriptionMetadataArray'] = description;
      newEntity['parentIds'] = parents;
      newEntity['childrenIds'] = children;

      resMaps.add(newEntity);
    });

    return resMaps;
  }

  Future<void> _cacheAll() async {
    var database = DatabaseHelper();
    var sessions = DataCarrier().getList<SessionEntity>().map((e) => e.id).toList();

    List<EventEntity> entities = [];

    _map.forEach((key, value) {
      if (sessions.contains(key) || sessions.isEmpty) {
        entities.addAll(value);
      }
    });

    List<Map<String, Object>> fieldsMaps = [];
    List<Map<String, Object>> idsMaps = [];

    entities.forEach((e) {
      var characters = e.characterValues
          .map((f) => f.toMap(entityTable: tableName, entityId: e.id, entityType: 'characters'));
      var places =
          e.placeValues.map((f) => f.toMap(entityTable: tableName, entityId: e.id, entityType: 'places'));
      var description = e.descriptionValues
          .map((f) => f.toMap(entityTable: tableName, entityId: e.id, entityType: 'description'));
      var parents = DatabaseHelper.listToValueMaps(e.parentIds,
          entityId: e.id, entityTable: tableName, entityType: 'parents');
      var children = DatabaseHelper.listToValueMaps(e.childrenIds,
          entityId: e.id, entityTable: tableName, entityType: 'children');

      fieldsMaps.addAll(characters);
      fieldsMaps.addAll(places);
      fieldsMaps.addAll(description);

      idsMaps.addAll(parents);
      idsMaps.addAll(children);
    });

    var entitiesMaps = entities.map((e) {
      var map = e.toMap();
      map.remove('parentIds');
      map.remove('childrenIds');
      map.remove('charactersMetadataArray');
      map.remove('placeMetadataArray');
      map.remove('descriptionMetadataArray');

      return map;
    }).toList();

    await Future.wait([
      database.delete(tableName),
      database.delete(FieldValue.tableName, where: 'entityTable = ?', whereArgs: [tableName]),
      database.delete('integers', where: 'entityTable = ?', whereArgs: [tableName]),
    ]);
    await Future.wait([
      database.insertList(tableName, entitiesMaps),
      database.insertList(FieldValue.tableName, fieldsMaps),
      database.insertList('integers', idsMaps),
    ]);
  }
}
