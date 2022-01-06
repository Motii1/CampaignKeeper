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
  Image userImage = DataCarrier().getEntity<UserDataEntity>()!.image;

  @override
  void initState() {
    super.initState();
    DataCarrier().addListener<UserDataEntity>(() {
      if (this.mounted) {
        setState(() {
          userImage = DataCarrier().getEntity<UserDataEntity>()!.image;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return ClipOval(
      child: Material(
        color: Colors.transparent,
        child: PopupMenuButton(
          child: Padding(
            padding: const EdgeInsets.all(10),
            child: CircleAvatar(
              radius: 14,
              backgroundColor: Colors.transparent,
              backgroundImage: userImage.image,
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
      this.onRefresh,
      required this.title,
      required this.sliver,
      this.autoLeading = true,
      this.changeBgColor = false})
      : super(key: key);

  final String title;
  final Widget sliver;
  final Color? backgroundColor;
  final bool autoLeading;
  final bool changeBgColor;
  final List<PopupMenuEntry<dynamic>> Function(BuildContext)? popupItemBuilder;
  final void Function(dynamic)? popupOnSelected;
  final Future<void> Function()? onRefresh;
  final double _expandedHeight = 180.0;
  final double _collapsedHeight = 66;

  bool canPop(BuildContext context) {
    final NavigatorState? navigator = Navigator.maybeOf(context);
    return navigator != null && navigator.canPop() && autoLeading;
  }

  Future<void> _refresh() {
    return Future.delayed(Duration(seconds: 0));
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
                elevation: innerBoxIsScrolled ? 6 : 0,
                shadowColor: Colors.black.withOpacity(0.25),
                forceElevated: true,
                pinned: true,
                collapsedHeight: _collapsedHeight,
                expandedHeight: _expandedHeight,
                backgroundColor: _bgColor,
                flexibleSpace: LayoutBuilder(
                  builder: (BuildContext context, BoxConstraints constraints) {
                    double _realAppBarHeight =
                        MediaQuery.of(context).padding.top + _collapsedHeight;
                    double increasePercent =
                        (constraints.biggest.height - _realAppBarHeight) /
                            (_expandedHeight - _realAppBarHeight);
                    return AnimatedContainer(
                      duration: Duration(milliseconds: 100),
                      color: (innerBoxIsScrolled && changeBgColor)
                          ? Theme.of(context).colorScheme.surface
                          : _bgColor,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Padding(
                                padding: EdgeInsets.only(
                                  left: 5,
                                  right: 5,
                                ),
                                child: canPop(context)
                                    ? IconButton(
                                        onPressed: () {
                                          Navigator.pop(context);
                                        },
                                        icon: Icon(
                                          Icons.arrow_back,
                                          size: 24,
                                          color: Theme.of(context)
                                              .appBarTheme
                                              .titleTextStyle!
                                              .color,
                                        ),
                                      )
                                    : Container(width: 7),
                              ),
                              Expanded(
                                child: Text(
                                  title,
                                  style: TextStyle(
                                    color: Theme.of(context)
                                        .appBarTheme
                                        .titleTextStyle!
                                        .color,
                                    fontSize: 23 + (increasePercent * 6),
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                              ConstrainedBox(
                                  constraints: BoxConstraints(
                                minHeight: _collapsedHeight,
                              )),
                              Padding(
                                padding: EdgeInsets.only(
                                  right: 2,
                                ),
                                child: popupItemBuilder == null
                                    ? Container()
                                    : KeeperPopup(
                                        itemBuilder: popupItemBuilder!,
                                        onSelected: popupOnSelected),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ),
          ];
        },
        body: RefreshIndicator(
          onRefresh: onRefresh ?? _refresh,
          color: Theme.of(context).colorScheme.onBackground,
          displacement: onRefresh == null ? 0 : 50,
          strokeWidth: 2.5,
          child: Builder(
            builder: (BuildContext context) {
              return CustomScrollView(
                slivers: [
                  SliverOverlapInjector(
                    handle: NestedScrollView.sliverOverlapAbsorberHandleFor(
                        context),
                  ),
                  sliver,
                ],
              );
            },
          ),
        ),
      ),
    );
  }
}
