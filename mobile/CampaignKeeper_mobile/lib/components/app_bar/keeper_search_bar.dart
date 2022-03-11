import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:flutter/material.dart';
import 'dart:math';

class KeeperSearchBar extends StatelessWidget {
  KeeperSearchBar(
      {Key? key,
      required this.title,
      required this.sliver,
      this.popup,
      this.onRefresh,
      this.autoLeading = true})
      : super(key: key);

  final String title;
  final Widget sliver;
  final bool autoLeading;
  final KeeperPopup? popup;
  final Future<void> Function()? onRefresh;
  final double _expandedHeight = 180.0;
  final double _collapsedHeight = 75;

  bool canPop(BuildContext context) {
    final NavigatorState? navigator = Navigator.maybeOf(context);
    return navigator != null && navigator.canPop() && autoLeading;
  }

  Future<void> _refresh() {
    return Future.delayed(Duration(seconds: 0));
  }

  @override
  Widget build(BuildContext context) {
    return NotificationListener<OverscrollIndicatorNotification>(
      onNotification: (overScroll) {
        overScroll.disallowIndicator();
        return false;
      },
      child: NestedScrollView(
        headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
          return [
            SliverOverlapAbsorber(
              handle: NestedScrollView.sliverOverlapAbsorberHandleFor(context),
              sliver: SliverAppBar(
                automaticallyImplyLeading: false,
                elevation: innerBoxIsScrolled ? 5 : 0,
                shadowColor: Theme.of(context).colorScheme.brightness == Brightness.light
                    ? Colors.black.withOpacity(0.25)
                    : Colors.white.withOpacity(0.075),
                forceElevated: true,
                pinned: true,
                collapsedHeight: _collapsedHeight,
                expandedHeight: _expandedHeight,
                backgroundColor: Theme.of(context).appBarTheme.backgroundColor!,
                flexibleSpace: LayoutBuilder(
                  builder: (BuildContext context, BoxConstraints constraints) {
                    double _realAppBarHeight = MediaQuery.of(context).padding.top + _collapsedHeight;
                    double expandedPercent = min(
                        (constraints.biggest.height - _realAppBarHeight) /
                            (_expandedHeight - _realAppBarHeight),
                        1.0);
                    return Container(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: EdgeInsets.only(left: 57.5, right: 8),
                            child: Text(
                              title,
                              style: TextStyle(
                                color: Theme.of(context)
                                    .appBarTheme
                                    .titleTextStyle!
                                    .color
                                    ?.withOpacity(expandedPercent),
                                fontSize: 24.5 + expandedPercent * 1.5,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          _SearchBar(autoLeading: autoLeading, popup: popup),
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
                    handle: NestedScrollView.sliverOverlapAbsorberHandleFor(context),
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

class _SearchBar extends StatelessWidget {
  const _SearchBar({Key? key, this.autoLeading = true, this.popup}) : super(key: key);

  final bool autoLeading;
  final KeeperPopup? popup;

  bool canPop(BuildContext context) {
    final NavigatorState? navigator = Navigator.maybeOf(context);
    return navigator != null && navigator.canPop() && autoLeading;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(8, 8, 8, 6),
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(30))),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Padding(
                padding: EdgeInsets.only(
                  left: 0,
                  right: 0,
                ),
                child: canPop(context)
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(50.0),
                        child: Material(
                          color: Colors.transparent,
                          child: IconButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            padding: EdgeInsets.only(left: 10, right: 6),
                            icon: Icon(
                              Icons.arrow_back,
                              size: 23.5,
                              color: Theme.of(context).appBarTheme.titleTextStyle!.color,
                            ),
                          ),
                        ),
                      )
                    : Padding(
                        padding: EdgeInsets.fromLTRB(15, 0, 10, 0),
                        child: Icon(
                          Icons.search_outlined,
                          size: 23.5,
                          color: Theme.of(context).appBarTheme.titleTextStyle!.color,
                        ),
                      )),
            Expanded(
              child: Text(
                "Search",
                style: TextStyle(
                  color: Theme.of(context).appBarTheme.titleTextStyle!.color?.withOpacity(0.75),
                  fontSize: 20,
                  fontWeight: FontWeight.w400,
                ),
              ),
            ),
            popup ?? Container(),
          ],
        ),
      ),
    );
  }
}
