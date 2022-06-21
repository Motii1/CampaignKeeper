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
  void attach(ObjectEntity entity) {
    _attach(entity);
    _cacheAll();
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
  Future<bool> refresh({int groupId = -1, bool online = true}) async {
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

    if (online && groupId > -1) {
      Response userResponse = await RequestHelper()
          .get(endpoint: ObjectEntity.endpoint, params: [RequestParameter(name: "schemaId", value: groupId)]);

      if (userResponse.status == ResponseStatus.Success && userResponse.data != null) {
        Map responseData = json.decode(userResponse.data!);
        List<ObjectEntity> newEntities =
            (responseData['objects'] as List).map((e) => _decodeEntity(e)).toList();

        if (_isEqual(groupId, newEntities)) {
          return false;
        }

        _map[groupId] = newEntities;

        notifyListeners();
        _cacheAll();

        return true;
      } else if (userResponse.status == ResponseStatus.IncorrectData) {
        _map[groupId]?.clear();

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

  void _attach(ObjectEntity entity) {
    int schemaId = entity.schemaId;
    if (_map[schemaId] == null) {
      _map[schemaId] = [];
    }

    _map[schemaId]!.add(entity);
  }

  bool _isEqual(int groupId, List<ObjectEntity> newEntities) {
    if (newEntities.length == _map[groupId]?.length) {
      for (int i = 0; i < newEntities.length; i++) {
        if (!newEntities[i].equals(_map[groupId]![i])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  void _cacheAll() {
    _checkIntegrity();

    var data = [];
    _map.forEach(
      (_, list) {
        data.addAll(list.map((e) => _encodeEntity(e)));
      },
    );

    CacheUtil().add(_key, json.encode(data));
  }

  void _checkIntegrity() {
    if (_map.isNotEmpty) {
      var schemas = DataCarrier().getList<SchemaEntity>().map((e) => e.id).toList();

      if (schemas.isNotEmpty) {
        var keys = List.from(_map.keys);

        keys.forEach((key) {
          if (!schemas.contains(key)) {
            _map.remove(key);
          }
        });
      }
    }
  }

  ObjectEntity _decodeEntity(Map data) {
    int id = data['id'];
    int schemaId = data['schemaId'];
    String title = data['title'];
    String? imageData = data['imageBase64'];
    List<FieldValue> values =
        (data['metadataArray'] as List<dynamic>).map((e) => FieldValue.decode(e)).toList();

    return ObjectEntity(id: id, schemaId: schemaId, title: title, imageData: imageData, values: values);
  }

  Map _encodeEntity(ObjectEntity entity) {
    Map data = {
      'id': entity.id,
      'schemaId': entity.schemaId,
      'title': entity.title,
      'imageBase64': entity.imageData,
      'metadataArray': entity.values.map((e) => FieldValue.encode(e)).toList(),
    };

    return data;
  }
}
