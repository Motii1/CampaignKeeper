import 'package:campaign_keeper_mobile/entities/base_entity.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseHelper {
  DatabaseHelper._internal();

  static final DatabaseHelper _dbHelper = DatabaseHelper._internal();

  factory DatabaseHelper() => _dbHelper;

  late Database _database;
  bool _initialized = false;

  Future<void> initialize() async {
    if (_initialized) return;

    _database = await openDatabase(
      join(await getDatabasesPath(), 'campaign_database.db'),
      onCreate: ((db, version) {
        return db.execute(
            'CREATE TABLE ${_getEntityTableName(CampaignEntity)}(id INTEGER PRIMARY KEY, name TEXT, createdAt TEXT, imageBase64 TEXT)');
      }),
      version: 1,
    );
    _initialized = true;
  }

  Future<void> insertToTable(String tableName, Map<String, Object?> data) async {
    await _database.insert(tableName, data);
  }

  Future<void> insert<T extends BaseEntity>(Map<String, Object?> data) async {
    String? tableName = _getEntityTableName(T);

    if (tableName == null) {
      throw Exception("This entity is not supported by database");
    }

    await insertToTable(tableName, data);
  }

  Future<void> insertListToTable(String tableName, List<Map<String, Object?>> data) async {
    Batch batch = _database.batch();

    data.forEach((element) {
      batch.insert(tableName, element);
    });

    await batch.commit(noResult: true);
  }

  Future<void> insertList<T extends BaseEntity>(List<Map<String, Object?>> data) async {
    String? tableName = _getEntityTableName(T);

    if (tableName == null) {
      throw Exception("This entity is not supported by database");
    }

    await insertListToTable(tableName, data);
  }

  Future<List<Map>> getFromTable(String tableName, {String? where, List<Object?>? whereArgs}) async {
    return await _database.query(tableName, where: where, whereArgs: whereArgs);
  }

  Future<List<Map>> get<T extends BaseEntity>({String? where, List<Object?>? whereArgs}) async {
    String? tableName = _getEntityTableName(T);

    if (tableName == null) {
      throw Exception("This entity is not supported by database");
    }

    return await getFromTable(tableName, where: where, whereArgs: whereArgs);
  }

  String? _getEntityTableName(Type T) {
    switch (T) {
      case CampaignEntity:
        return 'campaigns';
      default:
        return null;
    }
  }
}
