import 'dart:io';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

class DependenciesHelper {
  static final DependenciesHelper _deps = DependenciesHelper._internal();

  factory DependenciesHelper() {
    return _deps;
  }

  FlutterSecureStorage _secureStorage = new FlutterSecureStorage();
  SharedPreferences? _storage;
  http.Client _client = http.Client();

  DependenciesHelper._internal();

  void useMocks({FlutterSecureStorage? secureStorage, SharedPreferences? storage, http.Client? client}) {
    if (secureStorage != null) {
      _secureStorage = secureStorage;
    }

    if (storage != null) {
      _storage = storage;
    }

    if (client != null) {
      _client = client;
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

  http.Client get client {
    return _client;
  }
}