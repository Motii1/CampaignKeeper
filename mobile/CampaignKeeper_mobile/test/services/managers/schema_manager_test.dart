import 'dart:convert';

import 'package:campaign_keeper_mobile/entities/schema_ent.dart';
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

  group("Schema manager test", () {
    test("Get entity", () async {
      var ent = SchemaEntity(
        id: 1,
        campaignId: 1,
        title: "Title",
        fields: [],
      );

      await dc.clear();
      await dc.attach(ent);

      SchemaEntity? getEnt = dc.get(entId: 1);

      expect(getEnt, ent);
    });

    test("Get entity in list", () async {
      var ent = SchemaEntity(
        id: 1,
        campaignId: 1,
        title: "Title",
        fields: [],
      );

      await dc.clear();
      await dc.attach(ent);

      List<SchemaEntity> list = dc.getList(groupId: 1);

      expect(list.length, 1);
      expect(list[0], ent);
    });

    test("Refresh", () async {
      await dc.clear();

      var ent = SchemaEntity(
        id: 1,
        campaignId: 1,
        title: "Title",
        fields: [],
      );
      Map getResponseData = {
        "schemas": [ent.toMap()],
      };
      String jsonData = json.encode(getResponseData);

      client.getResponse = http.Response(jsonData, 200);

      bool refreshResult = await dc.refresh<SchemaEntity>(parameterValue: 1);

      expect(refreshResult, true);

      SchemaEntity? newEnt = dc.get(entId: 1);

      expect(ent.equals(newEnt), true);

      List<Map>? storageValues = DatabaseMock.db.map[SchemaEntity.tableName];

      expect(storageValues == null, false);

      expect(storageValues!.length, 1);

      Map storageValue = storageValues[0];
      storageValue['fields'] = [];

      var storageEnt = SchemaEntity.fromMap(storageValue);

      expect(ent.equals(storageEnt), true);
    });
  });
}
