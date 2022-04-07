import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/helpers/dependencies_helper.dart';
import 'package:campaign_keeper_mobile/services/managers/user_data_manager.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'user_login_manager_test.mocks.dart';

// run flutter pub run build_runner build --delete-conflicting-outputs to generate mocks
@GenerateMocks([FlutterSecureStorage])
void main() {
  group("Testing User Data Manager", () {
    final secureStorage = MockFlutterSecureStorage();
    when(secureStorage.write(key: anyNamed('key'), value: anyNamed('value')));

    test("Adding new user", () {
      DependenciesHelper().useMocks(secureStorage: secureStorage);

      var manager = new UserDataManager();

      UserDataEntity? ent = manager.get();
      expect(ent == null, true);

      ent = new UserDataEntity(username: "Testtest", email: "Testtest@test.com", password: "Test");
      manager.attach(ent);

      expect(manager.get(), ent);
    });
    test("Getting user in a list", () {
      DependenciesHelper().useMocks(secureStorage: secureStorage);

      var manager = new UserDataManager();
      UserDataEntity ent =
          new UserDataEntity(username: "Testtest", email: "Testtest@test.com", password: "Test");
      manager.attach(ent);

      List list = manager.getList();

      expect(list.length, 1);
      expect(list[0], ent);
    });
  });
}
