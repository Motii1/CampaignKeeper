import 'package:campaign_keeper_mobile/components/app_bar/keeper_back_button.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/services/search_controllers/base_search_controller.dart';
import 'package:flutter/material.dart';
import 'dart:math';

import 'package:flutter/services.dart';

class KeeperSearchBar extends StatelessWidget {
  KeeperSearchBar(
      {Key? key,
      required this.title,
      required this.sliver,
      this.popup,
      this.onRefresh,
      this.autoLeading = true,
      this.searchController})
      : super(key: key);

  final String title;
  final Widget sliver;
  final bool autoLeading;
  final KeeperPopup? popup;
  final Future<void> Function()? onRefresh;
  final double _expandedHeight = 180.0;
  final double _collapsedHeight = 60;
  final BaseSearchController? searchController;

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
                flexibleSpace: LayoutBuilder(
                  builder: (BuildContext context, BoxConstraints constraints) {
                    double _realAppBarHeight = MediaQuery.of(context).padding.top + _collapsedHeight;
                    double expandedPercent = min(
                        (constraints.biggest.height - _realAppBarHeight) /
                            (_expandedHeight - _realAppBarHeight),
                        1.0);
                    return Stack(
                      alignment: Alignment.bottomCenter,
                      children: [
                        ClipRect(
                          child: Align(
                            alignment: Alignment.bottomCenter,
                            child: SizedBox(
                              width: constraints.biggest.width,
                              child: Padding(
                                padding: EdgeInsets.only(bottom: 55, left: 14, right: 14),
                                child: Text(
                                  title,
                                  style: TextStyle(
                                    color: Theme.of(context)
                                        .appBarTheme
                                        .titleTextStyle!
                                        .color
                                        ?.withOpacity(expandedPercent),
                                    overflow: TextOverflow.ellipsis,
                                    fontSize: 27 + expandedPercent * 2,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        _SearchBar(
                            autoLeading: autoLeading, popup: popup, searchController: searchController),
                      ],
                    );
                  },
                ),
              ),
            ),
          ];
        },
        body: RefreshIndicator(
          onRefresh: onRefresh ?? _refresh,
          edgeOffset: 55,
          color: Theme.of(context).colorScheme.onBackground,
          displacement: onRefresh == null ? 0 : 40,
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
  const _SearchBar({Key? key, this.autoLeading = true, this.popup, this.searchController}) : super(key: key);

  final bool autoLeading;
  final KeeperPopup? popup;
  final BaseSearchController? searchController;

  bool canPop(BuildContext context) {
    final NavigatorState? navigator = Navigator.maybeOf(context);
    return navigator != null && navigator.canPop() && autoLeading;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: EdgeInsets.fromLTRB(8, 0, 8, 10),
        child: Hero(
          tag: 'search',
          flightShuttleBuilder: (flightContext, animation, flightDirection, fromHeroContext, toHeroContext) {
            return _SearchBarAnimatedPlaceholder(
                animation: animation,
                canPop: canPop(context),
                paddingTop: MediaQuery.of(context).padding.top,
                popup: popup);
          },
          child: SafeArea(
            child: Material(
              color: Theme.of(context).colorScheme.surface,
              elevation: 0,
              borderRadius: BorderRadius.all(Radius.circular(35)),
              clipBehavior: Clip.antiAlias,
              child: InkWell(
                onTap: () {
                  if (searchController != null) {
                    SystemChannels.textInput.invokeMethod('TextInput.show');
                    Navigator.pushNamed(context, '/search', arguments: searchController);
                  }
                },
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    canPop(context)
                        ? KeeperBackButton(
                            padding: EdgeInsets.only(left: 10, right: 10),
                            constraints: BoxConstraints.expand(width: 44, height: 42))
                        : Padding(
                            padding: EdgeInsets.only(left: 15, right: 10),
                            child: Icon(
                              Icons.search_outlined,
                              size: 23.5,
                              color: Theme.of(context).appBarTheme.titleTextStyle!.color,
                            ),
                          ),
                    Expanded(
                      child: Text(
                        "Search",
                        style: TextStyle(
                          color: Theme.of(context).appBarTheme.titleTextStyle!.color?.withOpacity(0.75),
                          fontSize: 19,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ),
                    popup ?? Container(),
                  ],
                ),
              ),
            ),
          ),
        ));
  }
}

class _SearchBarAnimatedPlaceholder extends StatelessWidget {
  _SearchBarAnimatedPlaceholder(
      {Key? key, required this.animation, required this.canPop, required this.paddingTop, this.popup})
      : super(key: key);
  final bool canPop;
  final KeeperPopup? popup;
  final Animation<double> animation;
  final double paddingTop;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, _) {
        return Padding(
          padding: EdgeInsets.only(top: paddingTop * (1.0 - animation.value)),
          child: ClipRRect(
            borderRadius: BorderRadius.all(Radius.circular(35 * (1.0 - animation.value))),
            child: Material(
              color: Theme.of(context).colorScheme.surface,
              elevation: 0,
              child: Padding(
                padding: EdgeInsets.only(top: paddingTop * animation.value),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    canPop
                        ? KeeperBackButton(
                            padding: EdgeInsets.only(left: 10, right: 10),
                            constraints: BoxConstraints.expand(width: 44, height: 42))
                        : Padding(
                            padding: EdgeInsets.only(left: 15, right: 10),
                            child: Icon(
                              Icons.search_outlined,
                              size: 23.5,
                              color: Theme.of(context).appBarTheme.titleTextStyle!.color,
                            ),
                          ),
                    Expanded(
                      child: Text(
                        "Search",
                        style: TextStyle(
                          color: Theme.of(context).appBarTheme.titleTextStyle!.color?.withOpacity(0.75),
                          fontSize: 19,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ),
                    popup ?? Container(),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
