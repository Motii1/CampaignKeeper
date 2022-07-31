import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

// Helper used as an dependency injection tool.
class DependenciesHelper {
  static final DependenciesHelper _deps = DependenciesHelper._internal();

  factory DependenciesHelper() {
    return _deps;
  }

  FlutterSecureStorage _secureStorage = new FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
  );
  SharedPreferences? _storage;
  http.Client _client = http.Client();
  http.MultipartRequest Function(String, Uri) _multipartRequest =
      (type, uri) => http.MultipartRequest(type, uri);

  DependenciesHelper._internal();

  void useMocks({
    FlutterSecureStorage? secureStorage,
    SharedPreferences? storage,
    http.Client? client,
    http.MultipartRequest Function(String, Uri)? multipartRequest,
  }) {
    if (secureStorage != null) {
      _secureStorage = secureStorage;
    }

    if (storage != null) {
      _storage = storage;
    }

    if (client != null) {
      _client = client;
    }

    if (multipartRequest != null) {
      _multipartRequest = multipartRequest;
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

  http.MultipartRequest Function(String, Uri) get multipartRequest {
    return _multipartRequest;
  }
}
