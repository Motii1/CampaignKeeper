import 'dart:convert';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:collection/collection.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/types/http_types.dart';
import 'package:campaign_keeper_mobile/entities/schema_ent.dart';
import 'package:campaign_keeper_mobile/managers/base_manager.dart';
import 'package:campaign_keeper_mobile/services/cache_util.dart';

class SchemaManager extends BaseManager<SchemaEntity> {
  static const String _key = "Schema";
  Map<int, List<SchemaEntity>> _map = {};

  @override
  Future<void> attach(SchemaEntity entity) async {
    lockedOperation(
      () async {
        _attach(entity);
        _cacheAll();
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
      String? cache = await CacheUtil().get(_key);
      if (cache != null) {
        List cacheData = json.decode(cache);
        cacheData.forEach((data) {
          _attach(_decodeEntity(data));
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
            (responseData['schemas'] as List).map((e) => _decodeEntity(e)).toList();

        if (!_isEqual(parameterValue, newEntities)) {
          _map[parameterValue] = newEntities;

          notifyListeners();
          _cacheAll();

          return true;
        }
      } else if (userResponse.status == ResponseStatus.IncorrectData) {
        _map[parameterValue]?.clear();

        notifyListeners();
        _cacheAll();
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

  void _cacheAll() {
    var campaigns = DataCarrier().getList<CampaignEntity>().map((e) => e.id).toList();
    var data = [];

    _map.forEach(
      (key, list) {
        if (campaigns.isEmpty || campaigns.contains(key)) {
          data.addAll(list.map((e) => _encodeEntity(e)));
        }
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
