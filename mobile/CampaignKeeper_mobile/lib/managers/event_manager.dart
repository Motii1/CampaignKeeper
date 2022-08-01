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
    List<Map> charactersMaps = await getListFromDb('${tableName}_characters');
    List<Map> placesMaps = await getListFromDb('${tableName}_places');
    List<Map> descriptionMaps = await getListFromDb('${tableName}_description');
    List<Map> parentsMaps = await getListFromDb('${tableName}_parents');
    List<Map> childrenMaps = await getListFromDb('${tableName}_children');

    var characterDict = charactersMaps.groupListsBy((e) => e['eventId']);
    var placesDict = placesMaps.groupListsBy((e) => e['eventId']);
    var descriptionDict = descriptionMaps.groupListsBy((e) => e['eventId']);
    var parentsDict = parentsMaps.groupListsBy((e) => e['eventId']);
    var childrenDict = childrenMaps.groupListsBy((e) => e['eventId']);

    entMaps.forEach((ent) {
      var newEntity = Map.from(ent);

      var characters = characterDict[ent['id']] ?? [];
      var places = placesDict[ent['id']] ?? [];
      var description = descriptionDict[ent['id']] ?? [];

      var parents = (parentsDict[ent['id']] ?? []).map((e) => e['parentId'] as int).toList();
      var children = (childrenDict[ent['id']] ?? []).map((e) => e['childId'] as int).toList();

      newEntity['charactersMetadataArray'] = characters;
      newEntity['placeMetadataArray'] = places;
      newEntity['descriptionMetadataArray'] = description;
      newEntity['parentIds'] = parents;
      newEntity['childrenIds'] = children;

      resMaps.add(newEntity);
    });

    return resMaps;
  }

  List<Map<String, int>> _idsToMapList(int entId, List<int> ids, String fieldName) {
    return ids
        .map((e) => {
              'eventId': entId,
              fieldName: e,
            })
        .toList();
  }

  List<Map<String, Object>> _fieldsToMapList(int entId, List<FieldValue> fields) {
    return fields.map((e) {
      var map = FieldValue.encode(e);
      map['eventId'] = entId;

      return map;
    }).toList();
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

    List<Map<String, Object>> charactersMaps = [];
    List<Map<String, Object>> placesMaps = [];
    List<Map<String, Object>> descriptionMaps = [];
    List<Map<String, Object>> parentsMaps = [];
    List<Map<String, Object>> childMaps = [];

    entities.forEach((e) {
      var characters = _fieldsToMapList(e.id, e.characterValues);
      var places = _fieldsToMapList(e.id, e.placeValues);
      var description = _fieldsToMapList(e.id, e.descriptionValues);
      var parents = _idsToMapList(e.id, e.parentIds, 'parentId');
      var children = _idsToMapList(e.id, e.childrenIds, 'childId');

      charactersMaps.addAll(characters);
      placesMaps.addAll(places);
      descriptionMaps.addAll(description);
      parentsMaps.addAll(parents);
      childMaps.addAll(children);
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
      database.delete('${tableName}_characters'),
      database.delete('${tableName}_places'),
      database.delete('${tableName}_description'),
      database.delete('${tableName}_parents'),
      database.delete('${tableName}_children'),
    ]);
    await Future.wait([
      database.insertList(tableName, entitiesMaps),
      database.insertList('${tableName}_characters', charactersMaps),
      database.insertList('${tableName}_places', placesMaps),
      database.insertList('${tableName}_description', descriptionMaps),
      database.insertList('${tableName}_parents', parentsMaps),
      database.insertList('${tableName}_children', childMaps),
    ]);
  }
}
