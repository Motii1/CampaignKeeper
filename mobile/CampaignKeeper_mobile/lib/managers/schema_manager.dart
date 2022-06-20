import 'dart:convert';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/types/http_types.dart';
import 'package:collection/collection.dart';
import 'package:campaign_keeper_mobile/entities/schema_ent.dart';
import 'package:campaign_keeper_mobile/managers/base_manager.dart';
import 'package:campaign_keeper_mobile/services/cache_util.dart';

class SchemaManager extends BaseManager<SchemaEntity> {
  static const String _key = "Schema";
  Map<int, List<SchemaEntity>> _map = {};

  SchemaManager();

  @override
  void attach(SchemaEntity entity) {
    _attach(entity);
    _cacheAll();
  }

  @override
  SchemaEntity? get({int groupId = -1, int entId = -1}) {
    for (var key in _map.keys) {
      var list = _map[key];
      if (list != null) {
        var res = list.firstWhereOrNull((ent) => ent.id == entId);

        if (res != null) {
          return res;
        }
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

    if (online) {
      Response userResponse = await RequestHelper().get(
          endpoint: SchemaEntity.endpoint, params: [RequestParameter(name: "campaignId", value: groupId)]);

      if (userResponse.status == ResponseStatus.Success && userResponse.data != null) {
        List<SchemaEntity> newEntities = [];
        Map responseData = json.decode(userResponse.data!);
        responseData['schemas'].forEach((data) {
          newEntities.add(_decodeEntity(data));
        });

        if (newEntities.length == _map[groupId]?.length) {
          bool isEqual = true;
          for (int i = 0; i < newEntities.length; i++) {
            if (!newEntities[i].equals(_map[groupId]![i])) {
              isEqual = false;
              i = newEntities.length;
            }
          }

          if (isEqual) {
            return false;
          }
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

  void _attach(SchemaEntity entity) {
    int campaignId = entity.campaignId;
    if (_map[campaignId] == null) {
      _map[campaignId] = [];
    }

    _map[campaignId]!.add(entity);
  }

  void _checkIntegrity() {
    if (_map.isNotEmpty) {
      var campaigns = DataCarrier().getList<CampaignEntity>().map((e) => e.id).toList();

      if (campaigns.isNotEmpty) {
        var keys = _map.keys;

        keys.forEach((key) {
          if (!campaigns.contains(key)) {
            _map.remove(key);
          }
        });
      }
    }
  }

  void _cacheAll() {
    _checkIntegrity();

    var data = [];
    _map.forEach(
      (_, list) {
        list.forEach((element) {
          data.add(_encodeEntity(element));
        });
      },
    );

    CacheUtil().add(_key, json.encode(data));
  }

  SchemaEntity _decodeEntity(Map data) {
    int id = data['id'];
    int campaignId = data['campaignId'];
    String title = data['title'];
    List<String> fields = (data['fields'] as List<dynamic>).map((e) => e as String).toList();

    return SchemaEntity(id: id, campaignId: campaignId, title: title, fields: fields);
  }

  Map _encodeEntity(SchemaEntity entity) {
    Map data = {
      "id": entity.id,
      "campaignId": entity.campaignId,
      "title": entity.title,
      "fields": entity.fields,
    };

    return data;
  }
}
