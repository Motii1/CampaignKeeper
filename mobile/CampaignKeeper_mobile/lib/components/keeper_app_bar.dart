import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:flutter/material.dart';

class KeeperPopup extends StatefulWidget {
  KeeperPopup({Key? key, required this.itemBuilder, this.onSelected})
      : super(key: key);

  final List<PopupMenuEntry<dynamic>> Function(BuildContext) itemBuilder;
  final void Function(dynamic)? onSelected;

  @override
  _KeeperPopupState createState() => _KeeperPopupState();
}

class _KeeperPopupState extends State<KeeperPopup> {
  Widget userImage = DataCarrier().getEntity<UserDataEntity>()!.image;

  @override
  void initState() {
    super.initState();
    DataCarrier().addListener<UserDataEntity>(() {
      setState(() {
        userImage = DataCarrier().getEntity<UserDataEntity>()!.image;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(24),
      child: Material(
        color: Colors.transparent,
        child: PopupMenuButton(
          child: Padding(
            padding: const EdgeInsets.all(10),
            child: CircleAvatar(
              radius: 14,
              backgroundColor: Theme.of(context).colorScheme.onBackground,
              child: ClipOval(
                child: userImage,
              ),
            ),
          ),
          itemBuilder: widget.itemBuilder,
          onSelected: widget.onSelected,
          offset: const Offset(0, 35),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(10)),
          ),
        ),
      ),
    );
  }
}

class KeeperAppBar extends StatelessWidget {
  KeeperAppBar(
      {Key? key,
      this.backgroundColor,
      this.popupItemBuilder,
      this.popupOnSelected,
      required this.title,
      required this.sliver,
      this.autoLeading = true})
      : super(key: key);

  final String title;
  final Widget sliver;
  final Color? backgroundColor;
  final bool autoLeading;
  final List<PopupMenuEntry<dynamic>> Function(BuildContext)? popupItemBuilder;
  final void Function(dynamic)? popupOnSelected;
  final double _expandedHeight = 160.0;
  final double _collapsedHeight = 58.4;
  double _realAppBarHeight = 24.0;

  bool canPop(BuildContext context) {
    final NavigatorState? navigator = Navigator.maybeOf(context);
    return navigator != null &&
        navigator.canPop() &&
        ModalRoute.of(context)!.settings.name != "/campaigns" &&
        autoLeading;
  }

  @override
  Widget build(BuildContext context) {
    Color _bgColor = backgroundColor == null
        ? Theme.of(context).colorScheme.background
        : backgroundColor!;

    return NotificationListener<OverscrollIndicatorNotification>(
      onNotification: (overScroll) {
        overScroll.disallowGlow();
        return false;
      },
      child: NestedScrollView(
        headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
          return [
            SliverOverlapAbsorber(
              handle: NestedScrollView.sliverOverlapAbsorberHandleFor(context),
              sliver: SliverAppBar(
                automaticallyImplyLeading: false,
                pinned: true,
                collapsedHeight: _collapsedHeight,
                expandedHeight: _expandedHeight,
                backgroundColor: _bgColor,
                flexibleSpace: LayoutBuilder(
                  builder: (BuildContext context, BoxConstraints constraints) {
                    _realAppBarHeight =
                        MediaQuery.of(context).padding.top + _collapsedHeight;
                    double itemBottomPadding =
                        (constraints.biggest.height - _realAppBarHeight) /
                            (_expandedHeight - _realAppBarHeight) *
                            3.75;
                    return Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Padding(
                          padding: EdgeInsets.only(
                              left: 5,
                              right: 5,
                              bottom: 8.5 + itemBottomPadding),
                          child: canPop(context)
                              ? IconButton(
                                  onPressed: () {
                                    Navigator.pop(context);
                                  },
                                  icon: Icon(
                                    Icons.arrow_back,
                                    color: Theme.of(context)
                                        .appBarTheme
                                        .titleTextStyle!
                                        .color,
                                  ),
                                )
                              : Container(width: 7),
                        ),
                        Expanded(
                          child: FlexibleSpaceBar(
                            title: Text(
                              title,
                              style: TextStyle(
                                color: Theme.of(context)
                                    .appBarTheme
                                    .titleTextStyle!
                                    .color,
                              ),
                            ),
                            titlePadding: EdgeInsets.fromLTRB(0, 0, 0, 20),
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.only(
                              left: 0, right: 2, bottom: 8 + itemBottomPadding),
                          child: popupItemBuilder == null
                              ? Container()
                              : KeeperPopup(
                                  itemBuilder: popupItemBuilder!,
                                  onSelected: popupOnSelected),
                        ),
                      ],
                    );
                  },
                ),
              ),
            ),
          ];
        },
        body: Builder(
          builder: (BuildContext context) {
            return CustomScrollView(
              slivers: [
                SliverOverlapInjector(
                  handle:
                      NestedScrollView.sliverOverlapAbsorberHandleFor(context),
                ),
                sliver,
              ],
            );
          },
        ),
      ),
    );
  }
}
