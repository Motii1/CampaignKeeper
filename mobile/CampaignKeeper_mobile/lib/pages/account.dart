import 'package:campaign_keeper_mobile/components/app_bar/keeper_app_bar.dart';
import 'package:campaign_keeper_mobile/components/keeper_snack_bars.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/components/list/keeper_list_header.dart';
import 'package:campaign_keeper_mobile/components/list/keeper_list_tile.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/types/types.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class Account extends StatefulWidget {
  const Account({Key? key}) : super(key: key);

  @override
  State<Account> createState() => _AccountState();
}

class _AccountState extends KeeperState<Account> {
  UserDataEntity? ent = DataCarrier().get<UserDataEntity>();
  final ImagePicker picker = ImagePicker();
  final int maxImageSize = 500000;

  void updateEntity() {
    setState(() {
      ent = DataCarrier().get<UserDataEntity>();
    });
  }

  Future<String?> validateAvatar(XFile? image) async {
    if (image == null) {
      return "An image avatar change requires to choose.";
    } else if (await image.length() > maxImageSize) {
      return "Sir, this file is too heavy, we can't send it.";
    } else {
      return null;
    }
  }

  void pickAvatar() async {
    if (await RequestHelper().testConnection() == ResponseStatus.Success) {
      final XFile? image = await picker.pickImage(source: ImageSource.gallery);
      String? res = await validateAvatar(image);

      if (res == null && await DataCarrier().update<UserDataEntity>(data: image)) {
        return;
      }

      ScaffoldMessenger.of(context)
          .showSnackBar(KeeperSnackBars.snack(res ?? "I have bad feelings about that. Something is wrong."));
      return;
    } else {
      ScaffoldMessenger.of(context)
          .showSnackBar(KeeperSnackBars.snack("This action requires network connection."));
    }
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
                      onTap: pickAvatar,
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
