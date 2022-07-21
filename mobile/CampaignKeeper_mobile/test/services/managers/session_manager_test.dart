import 'dart:convert';

import 'package:campaign_keeper_mobile/entities/session_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/dependencies_helper.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

import '../../mocks/http_client_mock.dart';
import '../../mocks/secure_storage_mock.dart';
import '../../mocks/shared_storage_mock.dart';

void main() {
  group("Schema manager test", () {
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
      var ent = SessionEntity(
        id: 1,
        campaignId: 1,
        name: "Test",
        createdAt: DateTime.now(),
      );

      await dc.clear();
      await dc.attach(ent);

      SessionEntity? getEnt = dc.get(entId: 1);

      expect(getEnt, ent);
    });

    test("Get entity in list", () async {
      var ent = SessionEntity(
        id: 1,
        campaignId: 1,
        name: "Test",
        createdAt: DateTime.now(),
      );

      await dc.clear();
      await dc.attach(ent);

      List<SessionEntity> list = dc.getList(groupId: 1);

      expect(list.length, 1);
      expect(list[0], ent);
    });

    test("Refresh", () async {
      await dc.clear();

      var ent = SessionEntity(
        id: 1,
        campaignId: 1,
        name: "Test",
        createdAt: DateTime.now(),
      );
      Map getResponseData = {
        "sessions": [ent.encode()],
      };
      String jsonData = json.encode(getResponseData);

      client.getResponse = http.Response(jsonData, 200);

      bool refreshResult = await dc.refresh<SessionEntity>(parameterValue: 1);

      expect(refreshResult, true);

      SessionEntity? newEnt = dc.get(entId: 1);

      expect(ent.equals(newEnt), true);

      String storageValue = storage.value as String;

      List storageData = json.decode(storageValue);
      var storageEntity = SessionEntity.decode(storageData[0]);

      await Future.delayed(Duration(milliseconds: 500));

      expect(ent.equals(storageEntity), true);
    });
  });
}
