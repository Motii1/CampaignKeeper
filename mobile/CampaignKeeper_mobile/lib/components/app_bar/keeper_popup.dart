import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:flutter/material.dart';

// Widget representing popup using users avatar as a button.
class KeeperPopup extends StatefulWidget {
  KeeperPopup({Key? key, required this.itemBuilder, this.onSelected, this.padding}) : super(key: key);

  final List<PopupMenuEntry<dynamic>> Function(BuildContext) itemBuilder;
  final void Function(dynamic)? onSelected;
  final EdgeInsets? padding;

  @override
  _KeeperPopupState createState() => _KeeperPopupState();

  // A function returning a popup with most common options.
  static KeeperPopup settings(BuildContext context) {
    return KeeperPopup(
      itemBuilder: (BuildContext context) => [
        PopupMenuItem<String>(
          value: "Settings",
          child: Text("Settings"),
        )
      ],
      onSelected: (dynamic value) {
        switch (value) {
          case "Settings":
            Navigator.pushNamed(context, "/settings");
            break;
        }
      },
    );
  }
}

class _KeeperPopupState extends State<KeeperPopup> {
  Image? userImage = DataCarrier().get<UserDataEntity>()?.image;

  // Function run when user details are refreshed.
  // It sets a new avatar as an button.
  void refreshUserImage() {
    setState(() {
      userImage = DataCarrier().get<UserDataEntity>()?.image;
    });
  }

  @override
  void initState() {
    super.initState();
    DataCarrier().addListener<UserDataEntity>(refreshUserImage);
  }

  @override
  void dispose() {
    DataCarrier().removeListener<UserDataEntity>(refreshUserImage);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ClipOval(
      child: Material(
        color: Colors.transparent,
        child: PopupMenuButton(
          child: Padding(
            padding: widget.padding ?? EdgeInsets.all(7),
            child: CircleAvatar(
              radius: 14,
              backgroundColor: Theme.of(context).colorScheme.onBackground,
              foregroundImage: userImage?.image,
            ),
          ),
          itemBuilder: widget.itemBuilder,
          onSelected: widget.onSelected,
          offset: const Offset(0, 35),
        ),
      ),
    );
  }
}
