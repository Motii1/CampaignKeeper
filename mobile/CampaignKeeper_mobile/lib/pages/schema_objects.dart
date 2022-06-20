import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_search_bar.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
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

  Future<void> onRefresh() async {
    await DataCarrier().refresh<UserDataEntity>();
    await DataCarrier().refresh<SchemaEntity>(groupId: schema?.campaignId ?? -1);
    // TODO: Refresh objects from schema
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
    DataCarrier().refresh<SchemaEntity>(groupId: schema?.campaignId ?? -1);
  }

  @override
  void dispose() {
    DataCarrier().removeListener<SchemaEntity>(onSchemaRefresh);
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
