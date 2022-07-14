import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/helpers/dependencies_helper.dart';
import 'package:campaign_keeper_mobile/managers/user_data_manager.dart';
import 'package:flutter_test/flutter_test.dart';
import '../../mocks/secure_storage_mock.dart';

// run flutter pub run build_runner build --delete-conflicting-outputs to generate mocks
void main() {
  group("User Data Manager", () {
    final secureStorage = SecureStorageMock();

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
