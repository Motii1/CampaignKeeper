import 'package:campaign_keeper_mobile/services/cache_util.dart';
import 'package:campaign_keeper_mobile/services/helpers/dependencies_helper.dart';
import 'package:flutter_test/flutter_test.dart';

import '../mocks/secure_storage_mock.dart';

void main() {
  group("Secure storage test", () {
    final secureStorage = SecureStorageMock();
    DependenciesHelper().useMocks(secureStorage: secureStorage);
    final cacheUtil = CacheUtil();

    test("Write", () async {
      await cacheUtil.addSecure("Key", "Test value");

      expect(secureStorage.key, "Key");
      expect(secureStorage.value, "Test value");
    });

    test("Read", () async {
      secureStorage.key = "Test key";
      secureStorage.value = "Test value";

      String? retrivedValue = await cacheUtil.getSecure("Test key");

      expect(retrivedValue, "Test value");
    });

    test("Delete", () async {
      secureStorage.key = "Test key";
      secureStorage.value = "Test value";

      await cacheUtil.deleteSecure();

      expect(secureStorage.key, null);
      expect(secureStorage.value, null);
    });
  });

  group("Storage test", () {
    final cacheUtil = CacheUtil();

    test("Write and read", () async {
      await cacheUtil.add("Key", "Test value");

      String? retrievedValue = await cacheUtil.get("Key");

      expect(retrievedValue, "Test value");
    });

    test("Delete", () async {
      await cacheUtil.delete();

      String? retrievedValue = await cacheUtil.get("Key");

      expect(retrievedValue, null);
    });
  });
}
