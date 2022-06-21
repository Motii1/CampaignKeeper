import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/components/tiles/keeper_field_tile.dart';
import 'package:campaign_keeper_mobile/components/tiles/keeper_image_tile.dart';
import 'package:campaign_keeper_mobile/components/tiles/keeper_title_tile.dart';
import 'package:campaign_keeper_mobile/entities/object_ent.dart';
import 'package:campaign_keeper_mobile/entities/schema_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:flutter/material.dart';
import 'package:visibility_detector/visibility_detector.dart';

class ObjectExplorer extends StatefulWidget {
  const ObjectExplorer({Key? key, required this.objectId}) : super(key: key);
  final int objectId;

  @override
  State<ObjectExplorer> createState() => _ObjectExplorerState();
}

class _ObjectExplorerState extends KeeperState<ObjectExplorer> {
  late ObjectEntity? object = DataCarrier().get(entId: widget.objectId);
  late SchemaEntity? schema = DataCarrier().get(entId: object?.schemaId ?? -1);
  bool isTitleVisible = false;

  Future<void> onRefresh() async {
    DataCarrier().refresh<UserDataEntity>();
    await DataCarrier().refresh<SchemaEntity>(groupId: schema?.campaignId ?? -1);
    await DataCarrier().refresh<ObjectEntity>(groupId: schema?.id ?? -1);
  }

  Future<void> onObjectRefresh() async {
    ObjectEntity? entity = DataCarrier().get(entId: widget.objectId);

    if (entity == null) {
      returnTo('/start');
    } else {
      setState(() {
        object = entity;
      });
    }
  }

  Future<void> onSchemaRefresh() async {
    setState(() {
      schema = DataCarrier().get(entId: object?.schemaId ?? -1);
    });
  }

  Widget getFields() {
    if (schema == null || object == null) {
      return Center(
        child: Text("Error"),
      );
    }

    List<Widget> children = [];

    schema!.fields.forEach((field) {
      var values = object!.values.where((e) => e.fieldName == field).toList()
        ..sort(((a, b) => a.sequence.compareTo(b.sequence)));
      children.add(KeeperFieldTile(fieldName: field, values: values));
    });

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: children,
    );
  }

  @override
  void onReturn() async {
    DataCarrier().refresh<SchemaEntity>(groupId: schema?.campaignId ?? -1);
    DataCarrier().refresh<ObjectEntity>(groupId: object?.schemaId ?? -1);
  }

  @override
  void onResume() {
    DataCarrier().refresh<ObjectEntity>(groupId: object?.schemaId ?? -1);
  }

  @override
  void initState() {
    super.initState();
    VisibilityDetectorController.instance.updateInterval = Duration(milliseconds: 200);
    DataCarrier().addListener<ObjectEntity>(onObjectRefresh);
    DataCarrier().addListener<SchemaEntity>(onSchemaRefresh);
    DataCarrier().refresh<SchemaEntity>(groupId: schema?.campaignId ?? -1);
    DataCarrier().refresh<ObjectEntity>(groupId: object?.schemaId ?? -1);
  }

  @override
  void dispose() {
    DataCarrier().removeListener<ObjectEntity>(onObjectRefresh);
    DataCarrier().removeListener<SchemaEntity>(onSchemaRefresh);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: AnimatedOpacity(
          duration: Duration(milliseconds: 200),
          opacity: isTitleVisible ? 1.0 : 0.0,
          child: Text(object?.title ?? ""),
        ),
        actions: [KeeperPopup.settings(context)],
      ),
      body: RefreshIndicator(
        color: Theme.of(context).colorScheme.onBackground,
        strokeWidth: 2.5,
        onRefresh: onRefresh,
        child: ListView(
          children: [
            KeeperImageTile(image: object?.image),
            VisibilityDetector(
              key: Key('object-title'),
              child: KeeperTitleTile(title: object?.title ?? ""),
              onVisibilityChanged: (visibilityInfo) {
                bool shouldTitleBeVisible = visibilityInfo.visibleFraction <= 0.4;

                if (isTitleVisible != shouldTitleBeVisible && this.mounted) {
                  setState(() {
                    isTitleVisible = shouldTitleBeVisible;
                  });
                }
              },
            ),
            getFields(),
            SizedBox(
              height: 55,
            ),
          ],
        ),
      ),
    );
  }
}
