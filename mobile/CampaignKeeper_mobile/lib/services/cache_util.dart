import 'package:campaign_keeper_mobile/services/helpers/dependencies_helper.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CacheUtil {
  static final CacheUtil _cache = CacheUtil._internal();

  factory CacheUtil() {
    return _cache;
  }

  CacheUtil._internal();

  Future<void> addSecure(String key, String value) async {
    await DependenciesHelper().secureStorage.write(key: key, value: value);
  }

  Future<String?> getSecure(String key) async {
    return await DependenciesHelper().secureStorage.read(key: key);
  }

  Future<void> deleteSecure() async {
    await DependenciesHelper().secureStorage.deleteAll();
  }

  Future<void> delete({String? key}) async {
    SharedPreferences prefs = await DependenciesHelper().storage;

    if (key == null) {
      await prefs.clear();
    } else {
      await prefs.remove(key);
    }
  }

  Future<void> add(String key, String value) async {
    SharedPreferences prefs = await DependenciesHelper().storage;
    await prefs.setString(key, value);
  }

  Future<String?> get(String key) async {
    SharedPreferences prefs = await DependenciesHelper().storage;
    return prefs.getString(key);
  }
}