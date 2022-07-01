import 'dart:convert';
import 'package:campaign_keeper_mobile/entities/event_ent.dart';
import 'package:campaign_keeper_mobile/entities/session_ent.dart';
import 'package:campaign_keeper_mobile/services/cache_util.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:campaign_keeper_mobile/types/http_types.dart';
import 'package:collection/collection.dart';
import 'package:campaign_keeper_mobile/managers/base_manager.dart';

class EventManager extends BaseManager<EventEntity> {
  static const String _key = "Event";
  Map<int, List<EventEntity>> _map = {};

  @override
  void attach(EventEntity entity) {
    _attach(entity);
    _cacheAll();
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
    if (_map.isEmpty) {
      String? cache = await CacheUtil().get(_key);
      if (cache != null) {
        List cacheData = json.decode(cache);
        cacheData.forEach((data) {
          _attach(_decodeEntity(data));
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
            (responseData['events'] as List).map((e) => _decodeEntity(e)).toList();

        if (_isEqual(parameterValue, newEntities)) {
          return false;
        }

        _map[parameterValue] = newEntities;

        notifyListeners();
        _cacheAll();

        return true;
      } else if (userResponse.status == ResponseStatus.IncorrectData) {
        _map[parameterValue]?.clear();

        notifyListeners();
        _cacheAll();
      }
    }

    return false;
  }

  @override
  void clear() {
    _map.clear();
    _cacheAll();
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

  void _cacheAll() {
    var sessions = DataCarrier().getList<SessionEntity>().map((e) => e.id).toList();
    var data = [];

    _map.forEach(
      (key, list) {
        if (sessions.isEmpty || sessions.contains(key)) {
          data.addAll(list.map((e) => _encodeEntity(e)));
        }
      },
    );

    CacheUtil().add(_key, json.encode(data));
  }

  EventEntity _decodeEntity(Map data) {
    int id = data['id'];
    int sessionId = data['sessionId'];
    String title = data['title'];
    String type = data['type'];
    String status = data['status'];
    String displayStatus = data['displayStatus'];
    List<FieldValue> characterValues = (data['charactersMetadataArray'] as List<dynamic>)
        .map((e) => FieldValue.decode(e, defaultFieldName: 'characters'))
        .toList();
    List<FieldValue> placeValues = (data['placeMetadataArray'] as List<dynamic>)
        .map((e) => FieldValue.decode(e, defaultFieldName: 'places'))
        .toList();
    List<FieldValue> descriptionValues = (data['descriptionMetadataArray'] as List<dynamic>)
        .map((e) => FieldValue.decode(e, defaultFieldName: 'descriptions'))
        .toList();
    List<int> parentIds = (data['parentIds'] as List<dynamic>).map((e) => e as int).toList();
    List<int> childrenIds = (data['childrenIds'] as List<dynamic>).map((e) => e as int).toList();

    return EventEntity(
      id: id,
      sessionId: sessionId,
      title: title,
      type: type,
      status: status,
      displayStatus: displayStatus,
      characterValues: characterValues,
      placeValues: placeValues,
      descriptionValues: descriptionValues,
      parentIds: parentIds,
      childrenIds: childrenIds,
    );
  }

  Map _encodeEntity(EventEntity entity) {
    Map data = {
      'id': entity.id,
      'sessionId': entity.sessionId,
      'title': entity.title,
      'type': entity.type,
      'status': entity.status,
      'displayStatus': entity.displayStatus,
      'charactersMetadataArray': entity.characterValues.map((e) => FieldValue.encode(e)).toList(),
      'placeMetadataArray': entity.placeValues.map((e) => FieldValue.encode(e)).toList(),
      'descriptionMetadataArray': entity.descriptionValues.map((e) => FieldValue.encode(e)).toList(),
      'parentIds': entity.parentIds,
      'childrenIds': entity.childrenIds,
    };

    return data;
  }
}
