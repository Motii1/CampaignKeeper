import 'dart:convert';
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
  void attach(CampaignEntity entity) {
    if (_entities.any((element) => element.id == entity.id)) {
      throw Exception("Attach campaign entity failed due to duplicate");
    }

    _entities.add(entity);

    _cacheAll();
  }

  @override
  CampaignEntity? get({int groupId = -1, int entId = -1}) {
    if (_entities.any((element) => element.id == entId)) {
      return _entities.firstWhere((element) => element.id == entId);
    } else {
      return null;
    }
  }

  @override
  List<CampaignEntity> getList({int groupId = -1}) {
    return _entities;
  }

  @override
  Future<bool> refresh({int groupId = -1, bool online = true}) async {
    if (_entities.isEmpty) {
      String? cache = await CacheUtil().get(_key);
      if (cache != null) {
        List cacheData = json.decode(cache);
        cacheData.forEach((data) {
          _entities.add(_decodeEntity(data));
        });

        notifyListeners();
      }
    }

    if (online) {
      List<CampaignEntity> newEntities = [];
      Response userResponse = await RequestHelper().get(endpoint: CampaignEntity.endpoint);

      if (userResponse.status == ResponseStatus.Success && userResponse.data != null) {
        Map responseData = json.decode(userResponse.data!);
        newEntities.clear();
        responseData['campaigns'].forEach((data) {
          newEntities.add(_decodeEntity(data));
        });

        if (_isEqual(newEntities)) {
          return false;
        }

        _entities = newEntities;
        notifyListeners();
        _cacheAll();
        return true;
      }
    }

    return false;
  }

  @override
  void clear() {
    _entities.clear();
  }

  bool _isEqual(List<CampaignEntity> newEntities) {
    if (newEntities.length == _entities.length) {
      for (int i = 0; i < newEntities.length; i++) {
        if (!newEntities[i].equals(_entities[i])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  void _cacheAll() {
    var data = [];
    data.addAll(_entities.map((e) => _encodeEntity(e)));

    CacheUtil().add(_key, json.encode(data));
  }

  CampaignEntity _decodeEntity(Map data) {
    int id = data['id'];
    String name = data['name'];
    DateTime createdAt = DateTime.parse(data['createdAt']);
    String? imageData = data['imageBase64'];

    return CampaignEntity(id: id, name: name, createdAt: createdAt, imageData: imageData);
  }

  Map _encodeEntity(CampaignEntity entity) {
    Map data = {
      "id": entity.id,
      "name": entity.name,
      "createdAt": entity.createdAt.toString(),
      "imageBase64": entity.imageData,
    };

    return data;
  }
}
