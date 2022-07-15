import 'dart:convert';

import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/dependencies_helper.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/types/http_types.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

import '../../mocks/http_client_mock.dart';
import '../../mocks/http_multipart_mock.dart';
import '../../mocks/secure_storage_mock.dart';

void main() {
  group("Request helper tests", () {
    final dc = DataCarrier();
    final secureStorage = SecureStorageMock();
    final client = HttpClientMock();
    DependenciesHelper().useMocks(secureStorage: secureStorage, client: client);

    test("Get success", () async {
      client.getResponse = http.Response("Test value", 200);

      Response response = await RequestHelper().get(endpoint: "/Test");

      expect(response.status, ResponseStatus.Success);
      expect(response.data, "Test value");
    });

    test("Get auto login", () async {
      var user = UserDataEntity(
        username: "Test",
        email: "Test",
        password: "Test",
      );

      dc.attach(user);

      Map userMap = {
        'username': "Test2",
        'email': "Test",
      };

      client.postResponse = http.Response(json.encode(userMap), 200);
      client.getResponse = http.Response("", 400);

      Response response = await RequestHelper().get(endpoint: "/Test");

      expect(response.status, ResponseStatus.IncorrectData);

      var newUser = dc.get<UserDataEntity>();

      expect(newUser?.username, "Test2");
    });

    test("Post success", () async {
      client.postResponse = http.Response("Test value", 200);

      Response response = await RequestHelper().post(endpoint: "/Test");

      expect(response.status, ResponseStatus.Success);
      expect(response.data, "Test value");
    });
  });

  group("Request helper tests", () {
    final secureStorage = SecureStorageMock();
    final multipart = HttpMultipartMock();
    DependenciesHelper().useMocks(secureStorage: secureStorage, multipartRequest: (_p0, _p1) => multipart);

    test("Put file success", () async {
      multipart.returnStatus = 200;

      Response response = await RequestHelper().putFile(endpoint: "/Test");

      expect(response.status, ResponseStatus.Success);
    });
  });
}
