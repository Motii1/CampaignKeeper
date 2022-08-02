import 'dart:convert';

import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/database_helper.dart';
import 'package:campaign_keeper_mobile/services/helpers/dependencies_helper.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

import '../../mocks/database_mock.dart';
import '../../mocks/http_client_mock.dart';
import '../../mocks/secure_storage_mock.dart';
import '../../mocks/shared_storage_mock.dart';

void main() async {
  final dc = DataCarrier();
  final client = HttpClientMock();
  final storage = SharedStorageMock();
  final secureStorage = SecureStorageMock();
  DependenciesHelper().useMocks(
    client: client,
    storage: storage,
    secureStorage: secureStorage,
    databaseFun: DatabaseMock.openDatabase,
    databasePath: '',
  );
  await DatabaseHelper().initialize();
  group("Campaign manager test", () {
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
        "campaigns": [ent.toMap()],
      };
      String jsonData = json.encode(getResponseData);

      client.getResponse = http.Response(jsonData, 200);

      bool refreshResult = await dc.refresh<CampaignEntity>();

      expect(refreshResult, true);

      CampaignEntity? newEnt = dc.get(entId: 1);

      expect(ent.equals(newEnt), true);

      List<Map>? storageValues = DatabaseMock.db.map[CampaignEntity.tableName];

      expect(storageValues == null, false);

      expect(storageValues!.length, 1);

      Map storageValue = storageValues[0];

      var storageEnt = CampaignEntity.fromMap(storageValue);

      expect(ent.equals(storageEnt), true);
    });
  });
}
