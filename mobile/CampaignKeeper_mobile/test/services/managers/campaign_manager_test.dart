import 'dart:convert';

import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/dependencies_helper.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

import '../../mocks/http_client_mock.dart';
import '../../mocks/secure_storage_mock.dart';
import '../../mocks/shared_storage_mock.dart';

void main() {
  group("Campaign manager test", () {
    final dc = DataCarrier();
    final client = HttpClientMock();
    final storage = SharedStorageMock();
    final secureStorage = SecureStorageMock();
    DependenciesHelper().useMocks(
      client: client,
      storage: storage,
      secureStorage: secureStorage,
    );

    test("Get entity", () async {
      var ent = CampaignEntity(id: 1, name: "Test", createdAt: DateTime.now());

      await dc.clear();
      await dc.attach<CampaignEntity>(ent);

      CampaignEntity? getEnt = dc.get<CampaignEntity>(entId: 1);

      expect(getEnt, ent);
    });

    test("Get entity in list", () async {
      var ent = CampaignEntity(id: 1, name: "Test", createdAt: DateTime.now());

      await dc.clear();
      await dc.attach(ent);

      List<CampaignEntity> list = dc.getList();

      expect(list.length, 1);
      expect(list[0], ent);
    });

    test("Refresh", () async {
      await dc.clear();

      var ent = CampaignEntity(id: 1, name: "Test", createdAt: DateTime.now());
      Map getResponseData = {
        "campaigns": [ent.encode()],
      };
      String jsonData = json.encode(getResponseData);

      client.getResponse = http.Response(jsonData, 200);

      bool refreshResult = await dc.refresh<CampaignEntity>();

      expect(refreshResult, true);

      CampaignEntity? newEnt = dc.get(entId: 1);

      expect(ent.equals(newEnt), true);

      String storageValue = storage.value as String;

      List storageData = json.decode(storageValue);
      var storageEntity = CampaignEntity.decode(storageData[0]);

      await Future.delayed(Duration(milliseconds: 500));

      expect(ent.equals(storageEntity), true);
    });
  });
}
