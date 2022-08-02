import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/entities/event_ent.dart';
import 'package:campaign_keeper_mobile/entities/schema_ent.dart';
import 'package:campaign_keeper_mobile/entities/session_ent.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/widgets.dart';
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

    WidgetsFlutterBinding.ensureInitialized();

    _database = await openDatabase(
      join(await getDatabasesPath(), 'campaign_database.db'),
      onCreate: ((db, version) async {
        await db
            .execute('CREATE TABLE strings(entityTable TEXT, entityType Text, entityId INTEGER, value TEXT)');
        await db.execute(
            'CREATE TABLE integers(entityTable TEXT, entityType Text, entityId INTEGER, value INTEGER)');
        await db.execute(
            'CREATE TABLE ${FieldValue.tableName}(entityTable TEXT, entityType Text, entityId INTEGER, type TEXT, sequenceNumber INTEGER, value TEXT, fieldName TEXT)');
        await db.execute(
            'CREATE TABLE ${SchemaEntity.tableName}(id INTEGER PRIMARY KEY, campaignId INTEGER, title TEXT)');
        await db.execute(
            'CREATE TABLE ${SessionEntity.tableName}(id INTEGER PRIMARY KEY, campaignId INTEGER, name TEXT, createdAt TEXT)');
        await db.execute(
            'CREATE TABLE ${CampaignEntity.tableName}(id INTEGER PRIMARY KEY, name TEXT, createdAt TEXT, imageBase64 TEXT)');
        await db.execute(
            'CREATE TABLE ${EventEntity.tableName}(id INTEGER PRIMARY KEY, sessionId INTEGER, title TEXT, type TEXT, status TEXT, displayStatus TEXT)');
      }),
      onUpgrade: (db, oldVersion, newVersion) async {},
      version: 1,
    );
    _initialized = true;
  }

  Future<void> insert(String tableName, Map<String, Object?> data) async {
    await _database.insert(
      tableName,
      data,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<void> insertList(String tableName, List<Map<String, Object?>> data) async {
    Batch batch = _database.batch();

    data.forEach((element) {
      batch.insert(
        tableName,
        element,
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    });

    await batch.commit(noResult: true);
  }

  Future<List<Map>> get(String tableName, {String? where, List<Object?>? whereArgs}) async {
    return await _database.query(tableName, where: where, whereArgs: whereArgs);
  }

  Future<void> delete(String tableName, {String? where, List<Object?>? whereArgs}) async {
    await _database.delete(tableName, where: where, whereArgs: whereArgs);
  }

  Future<void> clear() async {
    await delete(FieldValue.tableName);
    await delete('strings');
    await delete('integers');
    await delete(CampaignEntity.tableName);
    await delete(SchemaEntity.tableName);
    await delete(SessionEntity.tableName);
  }
}
