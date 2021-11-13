import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CacheUtil {
  static final CacheUtil _cache = CacheUtil._internal();
  final FlutterSecureStorage _secureStorage = new FlutterSecureStorage();

  factory CacheUtil() {
    return _cache;
  }

  CacheUtil._internal();

  Future<void> addSecure(String key, String value) async {
    await _secureStorage.write(key: key, value: value);
  }

  Future<String?> getSecure(String key) async {
    return await _secureStorage.read(key: key);
  }

  Future<void> deleteSecure() async {
    await _secureStorage.deleteAll();
  }

  Future<void> delete({String? key}) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    if (key == null) {
      await prefs.clear();
    } else {
      await prefs.remove(key);
    }
  }

  Future<void> add(String key, String value) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, value);
  }

  Future<String?> get(String key) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString(key);
  }
}