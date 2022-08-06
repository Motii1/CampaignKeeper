import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseMock implements Database {
  static DatabaseMock? _db;
  static Future<Database> openDatabase(
    String path, {
    int? version,
    OnDatabaseConfigureFn? onConfigure,
    OnDatabaseCreateFn? onCreate,
    OnDatabaseVersionChangeFn? onUpgrade,
    OnDatabaseVersionChangeFn? onDowngrade,
    OnDatabaseOpenFn? onOpen,
    bool readOnly = false,
    bool singleInstance = true,
  }) async {
    _db = DatabaseMock(version: version ?? 0);
    return _db!;
  }

  static DatabaseMock get db => _db!;

  DatabaseMock({required this.version});

  Map<String, List<Map<String, Object?>>> map = {};
  int version;

  @override
  Batch batch() {
    return BatchMock(db: this);
  }

  @override
  Future<void> close() async {}

  @override
  Future<int> delete(String table, {String? where, List<Object?>? whereArgs}) async {
    map.remove(table);
    return 0;
  }

  @override
  Future<T> devInvokeMethod<T>(String method, [arguments]) {
    throw UnimplementedError();
  }

  @override
  Future<T> devInvokeSqlMethod<T>(String method, String sql, [List<Object?>? arguments]) {
    throw UnimplementedError();
  }

  @override
  Future<void> execute(String sql, [List<Object?>? arguments]) async {}

  @override
  Future<int> getVersion() async {
    return version;
  }

  @override
  Future<int> insert(String table, Map<String, Object?> values,
      {String? nullColumnHack, ConflictAlgorithm? conflictAlgorithm}) async {
    if (!map.containsKey(table)) {
      map[table] = [];
    }

    map[table]!.add(values);

    return 0;
  }

  @override
  bool get isOpen => true;

  @override
  String get path => '';

  @override
  Future<List<Map<String, Object?>>> query(String table,
      {bool? distinct,
      List<String>? columns,
      String? where,
      List<Object?>? whereArgs,
      String? groupBy,
      String? having,
      String? orderBy,
      int? limit,
      int? offset}) async {
    return map[table] ?? [];
  }

  @override
  Future<int> rawDelete(String sql, [List<Object?>? arguments]) async {
    return 0;
  }

  @override
  Future<int> rawInsert(String sql, [List<Object?>? arguments]) async {
    return 0;
  }

  @override
  Future<List<Map<String, Object?>>> rawQuery(String sql, [List<Object?>? arguments]) async {
    return [];
  }

  @override
  Future<int> rawUpdate(String sql, [List<Object?>? arguments]) async {
    return 0;
  }

  @override
  Future<void> setVersion(int version) async {}

  @override
  Future<T> transaction<T>(Future<T> Function(Transaction txn) action, {bool? exclusive}) {
    throw UnimplementedError();
  }

  @override
  Future<int> update(String table, Map<String, Object?> values,
      {String? where, List<Object?>? whereArgs, ConflictAlgorithm? conflictAlgorithm}) {
    throw UnimplementedError();
  }
}

class BatchMock implements Batch {
  BatchMock({required this.db});

  DatabaseMock db;
  List<Tuple<String, Map<String, Object?>>> _queries = [];

  @override
  Future<List<Object?>> commit({bool? exclusive, bool? noResult, bool? continueOnError}) async {
    _queries.forEach((t) async {
      await db.insert(t.first, t.second);
    });

    return [];
  }

  @override
  void delete(String table, {String? where, List<Object?>? whereArgs}) {}

  @override
  void execute(String sql, [List<Object?>? arguments]) {}

  @override
  void insert(String table, Map<String, Object?> values,
      {String? nullColumnHack, ConflictAlgorithm? conflictAlgorithm}) {
    _queries.add(Tuple(first: table, second: values));
  }

  @override
  void query(String table,
      {bool? distinct,
      List<String>? columns,
      String? where,
      List<Object?>? whereArgs,
      String? groupBy,
      String? having,
      String? orderBy,
      int? limit,
      int? offset}) {}

  @override
  void rawDelete(String sql, [List<Object?>? arguments]) {}

  @override
  void rawInsert(String sql, [List<Object?>? arguments]) {}

  @override
  void rawQuery(String sql, [List<Object?>? arguments]) {}

  @override
  void rawUpdate(String sql, [List<Object?>? arguments]) {}

  @override
  void update(String table, Map<String, Object?> values,
      {String? where, List<Object?>? whereArgs, ConflictAlgorithm? conflictAlgorithm}) {}
}
