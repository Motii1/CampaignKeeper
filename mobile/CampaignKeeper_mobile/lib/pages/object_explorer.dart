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

// Page displaying a single object.
class ObjectExplorer extends StatefulWidget {
  const ObjectExplorer({Key? key, required this.objectId}) : super(key: key);
  final int objectId;

  @override
  State<ObjectExplorer> createState() => _ObjectExplorerState();
}

class _ObjectExplorerState extends KeeperState<ObjectExplorer> {
  final scrollController = ScrollController();
  late ObjectEntity? object = DataCarrier().get(entId: widget.objectId);
  late SchemaEntity? schema = DataCarrier().get(entId: object?.schemaId ?? -1);
  bool isTitleVisible = false;
  bool isScrolledToTop = true;

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

  void scrollListener() {
    if (scrollController.offset <= scrollController.position.minScrollExtent && !isScrolledToTop) {
      setState(() {
        isScrolledToTop = true;
      });
    } else {
      if (scrollController.offset > 5.0 && isScrolledToTop) {
        setState(() {
          isScrolledToTop = false;
        });
      }
    }
  }

  Widget objectItemBuilder(BuildContext context, int index) {
    if (index == 0) {
      return KeeperImageTile(image: object?.image);
    } else if (index == 1) {
      return VisibilityDetector(
        key: Key('object-title'),
        child: KeeperTitleTile(title: object?.title ?? ""),
        onVisibilityChanged: (visibilityInfo) {
          bool shouldTitleBeVisible = visibilityInfo.visibleFraction <= 0.5;

          if (isTitleVisible != shouldTitleBeVisible && this.mounted) {
            setState(() {
              isTitleVisible = shouldTitleBeVisible;
            });
          }
        },
      );
    } else if (schema != null && schema!.fields.length >= index - 2) {
      var fieldName = schema!.fields[index - 2];
      var values = object!.values.where((e) => e.fieldName == fieldName).toList()
        ..sort(((a, b) => a.sequence.compareTo(b.sequence)));

      return KeeperFieldTile(fieldName: fieldName, values: values);
    } else {
      return Center(
        child: Text("Error"),
      );
    }
  }

  @override
  void onReturn() async {
    DataCarrier().refresh<SchemaEntity>(groupId: schema?.campaignId ?? -1);
    DataCarrier().refresh<ObjectEntity>(groupId: object?.schemaId ?? -1);
  }

  @override
  void onResume() async {
    DataCarrier().refresh<ObjectEntity>(groupId: object?.schemaId ?? -1);
  }

  @override
  void initState() {
    super.initState();
    VisibilityDetectorController.instance.updateInterval = Duration(milliseconds: 300);
    scrollController.addListener(scrollListener);
    DataCarrier().addListener<ObjectEntity>(onObjectRefresh);
    DataCarrier().addListener<SchemaEntity>(onSchemaRefresh);
    DataCarrier().refresh<SchemaEntity>(groupId: schema?.campaignId ?? -1);
    DataCarrier().refresh<ObjectEntity>(groupId: object?.schemaId ?? -1);
  }

  @override
  void dispose() {
    scrollController.removeListener(scrollListener);
    DataCarrier().removeListener<ObjectEntity>(onObjectRefresh);
    DataCarrier().removeListener<SchemaEntity>(onSchemaRefresh);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: AnimatedOpacity(
          duration: Duration(milliseconds: 120),
          opacity: isTitleVisible ? 1.0 : 0.0,
          child: Text(object?.title ?? ""),
        ),
        actions: [KeeperPopup.settings(context)],
        elevation: isScrolledToTop ? 0 : 5,
      ),
      body: RefreshIndicator(
        color: Theme.of(context).colorScheme.onBackground,
        strokeWidth: 2.5,
        onRefresh: onRefresh,
        child: ListView.builder(
          physics: AlwaysScrollableScrollPhysics(),
          controller: scrollController,
          itemBuilder: objectItemBuilder,
          itemCount: schema != null ? schema!.fields.length + 2 : 2,
        ),
      ),
    );
  }
}
