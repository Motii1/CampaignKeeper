import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_search_bar.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/components/tiles/keeper_object_tile.dart';
import 'package:campaign_keeper_mobile/entities/object_ent.dart';
import 'package:campaign_keeper_mobile/entities/schema_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';

class SchemaObjects extends StatefulWidget {
  const SchemaObjects({Key? key, required this.schemaId}) : super(key: key);
  final int schemaId;

  @override
  State<SchemaObjects> createState() => _SchemaObjectsState();
}

class _SchemaObjectsState extends KeeperState<SchemaObjects> {
  late SchemaEntity? schema = DataCarrier().get(entId: widget.schemaId);
  late List<ObjectEntity> objects = DataCarrier().getList(groupId: schema?.id ?? -1);

  Future<void> onRefresh() async {
    await DataCarrier().refresh<UserDataEntity>();
    await DataCarrier().refresh<SchemaEntity>(groupId: schema?.campaignId ?? -1);
    await DataCarrier().refresh<ObjectEntity>(groupId: schema?.id ?? -1);
  }

  Future<void> onSchemaRefresh() async {
    SchemaEntity? entity = DataCarrier().get(entId: widget.schemaId);
    if (entity == null) {
      returnTo('/start');
    } else {
      setState(() {
        schema = entity;
      });
    }
  }

  Future<void> onObjectsRefresh() async {
    setState(() {
      objects = DataCarrier().getList(groupId: schema?.id ?? -1);
    });
  }

  Widget sliverList() {
    if (schema == null) {
      return SliverFillRemaining(
        hasScrollBody: false,
        child: SpinKitRing(
          color: Theme.of(context).colorScheme.onBackground,
          size: 40.0,
          lineWidth: 5.0,
        ),
      );
    }

    if (objects.length > 0) {
      return SliverList(
        delegate: SliverChildBuilderDelegate(
          (context, index) => KeeperObjectTile(
            entity: objects[index],
            onTap: () {
              //TODO: Open an object explorer
              print("should open an object");
            },
          ),
          childCount: objects.length,
        ),
      );
    }

    return SliverFillRemaining(
      hasScrollBody: false,
      child: Center(
        child: Text(
          "There's nothing here.\nFill your star map on our website!",
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  @override
  void onEveryResume() {
    DataCarrier().refresh<SchemaEntity>(groupId: schema?.campaignId ?? -1);
  }

  @override
  void onReturn() {
    onSchemaRefresh();
  }

  @override
  void initState() {
    super.initState();
    DataCarrier().addListener<SchemaEntity>(onSchemaRefresh);
    DataCarrier().addListener<ObjectEntity>(onObjectsRefresh);
    DataCarrier().refresh<SchemaEntity>(groupId: schema?.campaignId ?? -1);
    DataCarrier().refresh<ObjectEntity>(groupId: schema?.id ?? -1);
  }

  @override
  void dispose() {
    DataCarrier().removeListener<SchemaEntity>(onSchemaRefresh);
    DataCarrier().removeListener<ObjectEntity>(onObjectsRefresh);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: KeeperSearchBar(
        title: schema?.title ?? "",
        popup: KeeperPopup.settings(context),
        onRefresh: onRefresh,
        sliver: sliverList(),
        heroTag: "search_objects",
      ),
    );
  }
}
