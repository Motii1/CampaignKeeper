import 'package:shared_preferences/shared_preferences.dart';

class SharedStorageMock implements SharedPreferences {
  String? key;
  Object? value;

  @override
  Future<bool> clear() async {
    return true;
  }

  @override
  Future<bool> commit() {
    throw UnimplementedError();
  }

  @override
  bool containsKey(String key) {
    return key == this.key;
  }

  @override
  Object? get(String key) {
    if (key == this.key) {
      return value;
    }

    return null;
  }

  @override
  bool? getBool(String key) {
    if (key == this.key && value != null && value is bool) {
      return value as bool;
    }

    return null;
  }

  @override
  double? getDouble(String key) {
    if (key == this.key && value != null && value is double) {
      return value as double;
    }

    return null;
  }

  @override
  int? getInt(String key) {
    if (key == this.key && value != null && value is int) {
      return value as int;
    }

    return null;
  }

  @override
  Set<String> getKeys() {
    var set = Set<String>();
    if (key != null) {
      set.add(key!);
    }

    return set;
  }

  @override
  String? getString(String key) {
    if (key == this.key && value != null && value is String) {
      return value as String;
    }

    return null;
  }

  @override
  List<String>? getStringList(String key) {
    if (key == this.key && value != null && value is List<String>) {
      return value as List<String>;
    }

    return null;
  }

  @override
  Future<void> reload() async {}

  @override
  Future<bool> remove(String key) async {
    if (key == this.key) {
      this.key = null;
      value = null;

      return true;
    }

    return false;
  }

  @override
  Future<bool> setBool(String key, bool value) async {
    this.key = key;
    this.value = value;

    return true;
  }

  @override
  Future<bool> setDouble(String key, double value) async {
    this.key = key;
    this.value = value;

    return true;
  }

  @override
  Future<bool> setInt(String key, int value) async {
    this.key = key;
    this.value = value;

    return true;
  }

  @override
  Future<bool> setString(String key, String value) async {
    this.key = key;
    this.value = value;

    return true;
  }

  @override
  Future<bool> setStringList(String key, List<String> value) async {
    this.key = key;
    this.value = value;

    return true;
  }
}
