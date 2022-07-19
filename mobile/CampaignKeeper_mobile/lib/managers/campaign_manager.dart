import 'dart:convert';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:collection/collection.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/managers/base_manager.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/services/cache_util.dart';
import 'package:campaign_keeper_mobile/types/http_types.dart';

class CampaignManager extends BaseManager<CampaignEntity> {
  static const String _key = "Campaign";
  List<CampaignEntity> _entities = [];

  CampaignManager();

  @override
  Future<void> attach(CampaignEntity entity) async {
    lockedOperation(
      () async {
        _entities.add(entity);
        await _cacheAll();
      },
      defaultResult: null,
    );
  }

  @override
  CampaignEntity? get({int groupId = -1, int entId = -1}) {
    return _entities.firstWhereOrNull((element) => element.id == entId);
  }

  @override
  List<CampaignEntity> getList({int groupId = -1}) {
    return _entities;
  }

  @override
  Future<bool> refresh({EntityParameter? parameterName, int? parameterValue, bool online = true}) async {
    var refreshValue = RefreshParameter(parameter: parameterName, value: parameterValue);

    return await lockedOperation(
      () async {
        return await _refresh(parameterName: parameterName, parameterValue: parameterValue, online: online);
      },
      parameter: refreshValue,
      defaultResult: true,
    );
  }

  @override
  void clear() {
    _entities.clear();
  }

  Future<bool> _refresh({EntityParameter? parameterName, int? parameterValue, bool online = true}) async {
    if (_entities.isEmpty) {
      String? cache = await CacheUtil().get(_key);
      if (cache != null && cache.isNotEmpty) {
        List cacheData = json.decode(cache);

        _entities = cacheData.map((e) => CampaignEntity.decode(e)).toList();
        notifyListeners();
      }
    }

    if (online) {
      Response userResponse = await RequestHelper().get(endpoint: CampaignEntity.endpoint);

      if (userResponse.status == ResponseStatus.Success && userResponse.data != null) {
        Map responseData = json.decode(userResponse.data!);
        List<CampaignEntity> newEntities =
            (responseData['campaigns'] as List).map((e) => CampaignEntity.decode(e)).toList();

        if (!_isEqual(newEntities)) {
          _entities = newEntities;

          notifyListeners();
          await _cacheAll();

          return true;
        }
      }
    }

    return false;
  }

  bool _isEqual(List<CampaignEntity> newEntities) {
    if (newEntities.length != _entities.length) {
      return false;
    }

    for (int i = 0; i < newEntities.length; i++) {
      if (!newEntities[i].equals(_entities[i])) {
        return false;
      }
    }

    return true;
  }

  Future<void> _cacheAll() async {
    var data = _entities.map((e) => e.encode()).toList();

    await CacheUtil().add(_key, json.encode(data));
  }
}
