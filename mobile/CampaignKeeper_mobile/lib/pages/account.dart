import 'package:campaign_keeper_mobile/components/app_bar/keeper_app_bar.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/components/list/keeper_list_header.dart';
import 'package:campaign_keeper_mobile/components/list/keeper_list_tile.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:flutter/material.dart';

class Account extends StatefulWidget {
  const Account({Key? key}) : super(key: key);

  @override
  State<Account> createState() => _AccountState();
}

class _AccountState extends KeeperState<Account> {
  UserDataEntity? ent = DataCarrier().getEntity<UserDataEntity>();

  void updateEntity() {
    setState(() {
      ent = DataCarrier().getEntity<UserDataEntity>();
    });
  }

  @override
  void initState() {
    super.initState();
    DataCarrier().addListener<UserDataEntity>(updateEntity);
  }

  @override
  void dispose() {
    DataCarrier().removeListener<UserDataEntity>(updateEntity);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: KeeperAppBar(
        title: "Account",
        sliver: SliverList(
          delegate: SliverChildListDelegate(
            ent == null
                ? [
                    Center(
                      child: Text("Error"),
                    ),
                  ]
                : [
                    KeeperListHeader(title: "Avatar"),
                    KeeperListTile(
                      title: "Change avatar",
                      leading: CircleAvatar(
                        radius: 18.5,
                        backgroundColor: Theme.of(context).colorScheme.onBackground,
                        backgroundImage: ent!.image.image,
                      ),
                      onTap: () {
                        print("Here will try to change the avatar");
                      },
                    ),
                    KeeperListHeader(title: "Details"),
                    KeeperListTile(
                      title: ent!.username,
                      subtitle: ent!.email,
                    ),
                  ],
          ),
        ),
      ),
    );
  }
}
