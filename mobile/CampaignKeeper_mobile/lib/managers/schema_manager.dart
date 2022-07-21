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
      String? cache = await CacheUtil().get(_key);
      if (cache != null) {
        List cacheData = json.decode(cache);
        cacheData.forEach((data) {
          _attach(SchemaEntity.decode(data));
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
            (responseData['schemas'] as List).map((e) => SchemaEntity.decode(e)).toList();

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

  Future<void> _cacheAll() async {
    var campaigns = DataCarrier().getList<CampaignEntity>().map((e) => e.id).toList();

    await cacheMap(_map, _key, campaigns);
  }
}
