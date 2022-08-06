import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:sqflite/sqflite.dart' as sqflite;
import 'package:sqflite/sqflite.dart';

// Helper used as an dependency injection tool.
class DependenciesHelper {
  DependenciesHelper._internal();

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
  Future<sqflite.Database> Function(
    String, {
    int? version,
    sqflite.OnDatabaseConfigureFn? onConfigure,
    sqflite.OnDatabaseCreateFn? onCreate,
    sqflite.OnDatabaseVersionChangeFn? onUpgrade,
    sqflite.OnDatabaseVersionChangeFn? onDowngrade,
    sqflite.OnDatabaseOpenFn? onOpen,
    bool readOnly,
    bool singleInstance,
  }) _databaseFun = sqflite.openDatabase;
  String? _databasePath;

  void useMocks({
    FlutterSecureStorage? secureStorage,
    SharedPreferences? storage,
    http.Client? client,
    http.MultipartRequest Function(String, Uri)? multipartRequest,
    Future<sqflite.Database> Function(
      String, {
      int? version,
      sqflite.OnDatabaseConfigureFn? onConfigure,
      sqflite.OnDatabaseCreateFn? onCreate,
      sqflite.OnDatabaseVersionChangeFn? onUpgrade,
      sqflite.OnDatabaseVersionChangeFn? onDowngrade,
      sqflite.OnDatabaseOpenFn? onOpen,
      bool readOnly,
      bool singleInstance,
    })?
        databaseFun,
    String? databasePath,
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

    if (databaseFun != null) {
      _databaseFun = databaseFun;
    }

    if (databasePath != null) {
      _databasePath = databasePath;
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

  Future<sqflite.Database> Function(
    String, {
    int? version,
    sqflite.OnDatabaseConfigureFn? onConfigure,
    sqflite.OnDatabaseCreateFn? onCreate,
    sqflite.OnDatabaseVersionChangeFn? onUpgrade,
    sqflite.OnDatabaseVersionChangeFn? onDowngrade,
    sqflite.OnDatabaseOpenFn? onOpen,
    bool readOnly,
    bool singleInstance,
  }) get openDatabase {
    return _databaseFun;
  }

  Future<String> get databasePath async {
    return _databasePath ?? await getDatabasesPath();
  }
}
