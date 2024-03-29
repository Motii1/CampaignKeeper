import 'dart:convert';

import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/database_helper.dart';
import 'package:campaign_keeper_mobile/services/helpers/dependencies_helper.dart';
import 'package:campaign_keeper_mobile/services/helpers/login_helper.dart';
import 'package:campaign_keeper_mobile/types/http_types.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

import '../../mocks/database_mock.dart';
import '../../mocks/http_client_mock.dart';
import '../../mocks/secure_storage_mock.dart';

void main() async {
  final dc = DataCarrier();
  final secureStorage = SecureStorageMock();
  final client = HttpClientMock();
  DependenciesHelper().useMocks(
    secureStorage: secureStorage,
    client: client,
    databaseFun: DatabaseMock.openDatabase,
    databasePath: '',
  );
  await DatabaseHelper().initialize();

  group("Login helper test", () {
    test("Auto login succeed", () async {
      UserDataEntity? ent = UserDataEntity(
        username: "Test",
        email: "Test",
        password: "Test",
      );
      await dc.attach<UserDataEntity>(ent);

      Map userMap = {
        'username': "Test2",
        'email': "Test",
      };
      client.postResponse = http.Response(json.encode(userMap), 200);

      var tuple = await LoginHelper().autoLogin();
      ResponseStatus status = tuple.first;
      ent = tuple.second;

      expect(status, ResponseStatus.Success);
      expect(ent?.username, "Test2");
    });

    test("Auto login incorrect data without proper entity", () async {
      var ent = UserDataEntity(
        username: "Test",
        email: "Test",
      );

      await dc.attach<UserDataEntity>(ent);
      client.postResponse = http.Response("", 200);

      ResponseStatus status = (await LoginHelper().autoLogin()).first;

      expect(status, ResponseStatus.IncorrectData);
    });

    test("Auto login server error when offline", () async {
      var ent = UserDataEntity(
        username: "Test",
        email: "Test",
        password: "Test",
      );

      await dc.attach<UserDataEntity>(ent);
      client.postResponse = http.Response("", 500);

      ResponseStatus status = (await LoginHelper().autoLogin()).first;

      expect(status, ResponseStatus.Error);
    });

    test("Login succeed", () async {
      await dc.clear();

      Map userMap = {
        'username': "Test2",
        'email': "Test",
      };
      client.postResponse = http.Response(json.encode(userMap), 200);

      var tuple = await LoginHelper().login("Test", "Test");
      var status = tuple.first;
      UserDataEntity? ent = tuple.second;

      expect(status, ResponseStatus.Success);

      expect(ent != null, true);
      expect(ent?.username, "Test2");
      expect(ent?.password, "Test");
    });

    test("Logout clears data", () async {
      UserDataEntity? ent = UserDataEntity(
        username: "Test",
        email: "Test",
      );

      await dc.attach<UserDataEntity>(ent);

      ResponseStatus status = await LoginHelper().logout();

      expect(status, ResponseStatus.Success);

      ent = dc.get<UserDataEntity>();

      expect(ent, null);
    });
  });
}
