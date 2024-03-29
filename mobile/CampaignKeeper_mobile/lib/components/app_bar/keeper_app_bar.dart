import 'package:campaign_keeper_mobile/components/app_bar/keeper_back_button.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:flutter/material.dart';

// This widget provides comfortable, modern and scallable action bar
// that makes navigation easy with a taller smartphone.
// As required parameters it takes a title, a sliver body.
// Optionally it takes popup menu, function that runs on pull down refresh
// And an option to disable the back arrow.
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

  // Simple function that determines if navgiation
  // stack can be popped.
  bool canPop(BuildContext context) {
    final NavigatorState? navigator = Navigator.maybeOf(context);
    return navigator != null && navigator.canPop() && autoLeading;
  }

  @override
  Widget build(BuildContext context) {
    return NestedScrollView(
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
                                  color: Theme.of(context).colorScheme.onBackground,
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
      body: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          return onRefresh != null
              ? RefreshIndicator(
                  edgeOffset: 55,
                  onRefresh: onRefresh!,
                  color: Theme.of(context).colorScheme.onBackground,
                  strokeWidth: 2.5,
                  child: CustomScrollView(
                    slivers: [
                      SliverOverlapInjector(
                        handle: NestedScrollView.sliverOverlapAbsorberHandleFor(context),
                      ),
                      sliver,
                    ],
                  ),
                )
              : CustomScrollView(
                  slivers: [
                    SliverOverlapInjector(
                      handle: NestedScrollView.sliverOverlapAbsorberHandleFor(context),
                    ),
                    sliver,
                  ],
                );
        },
      ),
    );
  }
}
