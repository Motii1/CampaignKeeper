import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/services/helpers/dependencies_helper.dart';
import 'package:campaign_keeper_mobile/services/helpers/login_helper.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/types/http_types.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../mocks/secure_storage_mock.dart';

void main() {
  group("Request helper tests", () {
    final secureStorage = SecureStorageMock();
    DependenciesHelper().useMocks(secureStorage: secureStorage);

    // test("Test", () async {
    //   AppPrefs().url = "http://localhost:4000";

    //   var status = await LoginHelper().login("Testtest", "Testtest1!");

    //   expect(status, ResponseStatus.Success);

    //   Map<String, String> fields = {
    //     'currentPassword': "Testtest1!",
    //     'password': "Testtest2!",
    //     'repeatedPassword': "Testtest2!",
    //   };

    //   Response response = await RequestHelper().put(endpoint: "/api/user/details", fields: fields);

    //   String? text = response.data;

    //   expect(response.status, ResponseStatus.Success);
    // });
  });
}
