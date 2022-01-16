import 'package:campaign_keeper_mobile/services/helpers/dependencies_helper.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:campaign_keeper_mobile/services/managers/user_login_manager.dart';
import 'package:campaign_keeper_mobile/entities/user_login_ent.dart';
import 'package:mockito/mockito.dart';

import 'user_login_manager_test.mocks.dart';

@GenerateMocks([FlutterSecureStorage])
void main() {
  group("Testing User Login Manager", () {
    final secureStorage = MockFlutterSecureStorage();
    when(secureStorage.write(key: anyNamed('key'), value: anyNamed('value')));

    test("Adding new user", () {
      DependenciesHelper().useMocks(secureStorage: secureStorage);

      var manager = new UserLoginManager();

      UserLoginEntity? ent = manager.getEntity();
      expect(ent == null, true);

      ent = new UserLoginEntity(name: "Testtest", email: "Testtest@test.com", password: "Test");
      manager.attach(ent);

      expect(manager.getEntity(),  ent);
    });
    test("Get user in a list", () {
      DependenciesHelper().useMocks(secureStorage: secureStorage);
      
      var manager = new UserLoginManager();
      UserLoginEntity ent = new UserLoginEntity(name: "Testtest", email: "Testtest@test.com", password: "Test");
      manager.attach(ent);

      List list = manager.getEntities();

      expect(list.length, 1);
      expect(list[0], ent);
    });
  });
}