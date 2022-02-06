import 'dart:convert';

import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/services/managers/base_manager.dart';
import 'package:campaign_keeper_mobile/services//cache_util.dart';

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
  CampaignEntity? getEntity({int groupId = -1, int entId = -1}) {
    List<CampaignEntity?> data = _entities;
    return data.firstWhere((element) => element!.id == entId,
        orElse: () => null);
  }

  @override
  List<CampaignEntity> getEntities({int groupId = -1}) {
    return _entities;
  }

  //TODO: make proper refresh
  @override
  Future<bool> refresh({int groupId = -1}) async {
    _entities.clear();

    _entities.add(new CampaignEntity(id: 1, name: "One"));
    _entities.add(new CampaignEntity(id: 2, name: "Two"));
    _entities.add(new CampaignEntity(id: 3, name: "Three"));
    _entities.add(new CampaignEntity(id: 4, name: "Four"));

    notifyListeners();
    return true;
  }

  @override
  void clear() {
    _entities = [];
  }

  void _cacheAll() {
    var data = _entities.map((e) => _mapEntity(e));
    CacheUtil().add(_key, json.encode(data));
  }

  Map _mapEntity(CampaignEntity entity) {
    Map data = {
      "id": entity.id,
      "name": entity.name,
      "imageData": entity.imageData,
    };

    return data;
  }
}
