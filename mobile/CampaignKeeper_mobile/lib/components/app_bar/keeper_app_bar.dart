import 'package:campaign_keeper_mobile/components/app_bar/keeper_back_button.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:flutter/material.dart';

class KeeperAppBar extends StatelessWidget {
  KeeperAppBar(
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
                    double increasePercent = (constraints.biggest.height - _realAppBarHeight) /
                        (_expandedHeight - _realAppBarHeight);
                    return Container(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              canPop(context)
                                  ? KeeperBackButton(padding: EdgeInsets.symmetric(horizontal: 21.4))
                                  : Container(width: 17),
                              Expanded(
                                child: Text(
                                  title,
                                  style: TextStyle(
                                    color: Theme.of(context).appBarTheme.titleTextStyle!.color,
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
                                child: popup ?? Container(),
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
          edgeOffset: onRefresh == null ? -60 : 55,
          onRefresh: onRefresh ?? _refresh,
          color: Theme.of(context).colorScheme.onBackground,
          displacement: 40,
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
