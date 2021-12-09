import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DependenciesHelper {
  static final DependenciesHelper _deps = DependenciesHelper._internal();

  factory DependenciesHelper() {
    return _deps;
  }

  FlutterSecureStorage _secureStorage = new FlutterSecureStorage();
  SharedPreferences? _storage;

  DependenciesHelper._internal();

  void useMocks({FlutterSecureStorage? secureStorage, SharedPreferences? storage}) {
    if (secureStorage != null) {
      _secureStorage = secureStorage;
    }

    if (storage != null) {
      _storage = storage;
    }
  }

  FlutterSecureStorage get secureStorage {
    return _secureStorage;
  }

  Future<SharedPreferences> get storage async {
    if (_storage == null) {
      _storage = await SharedPreferences.getInstance();
    }

    return _storage!;
  }
}