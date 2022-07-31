import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/services/helpers/database_helper.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group(
    "Database helper tests",
    () {
      final dbHelper = DatabaseHelper();

      test("Insert and retrieve campaign entity", () async {
        // await dbHelper.initialize();
        // await dbHelper.delete<CampaignEntity>();

        // var ent = CampaignEntity(
        //   id: 1,
        //   name: "Test",
        //   createdAt: DateTime.now(),
        // );

        // dbHelper.insert<CampaignEntity>(ent.toMap());

        // var maps = await dbHelper.get<CampaignEntity>();

        // expect(maps.length, 1);

        // var entFromMap = CampaignEntity.fromMap(maps[0]);

        // expect(ent.equals(entFromMap), true);
      });
    },
  );
}
