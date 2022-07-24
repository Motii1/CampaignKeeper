import 'package:campaign_keeper_mobile/components/app_bar/keeper_back_button.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/search_controllers/base_search_controller.dart';
import 'package:flutter/material.dart';
import 'dart:math';

import 'package:flutter/services.dart';

// Modern and accessbile action bar featuring
// a search bar. It takes as arguments a title, sliver body,
// popup, refresh function and a search controller that
// will be used at the search page.
class KeeperSearchBar extends StatelessWidget {
  KeeperSearchBar(
      {Key? key,
      required this.title,
      required this.sliver,
      this.popup,
      this.onRefresh,
      this.autoLeading = true,
      this.heroTag = 'search',
      this.searchController})
      : super(key: key);

  final String title;
  final Widget sliver;
  final bool autoLeading;
  final KeeperPopup? popup;
  final Future<void> Function()? onRefresh;
  final String heroTag;
  final BaseSearchController? searchController;

  final double _expandedHeight = 180.0;
  final double _collapsedHeight = 60;

  // Simple function checking if navigation stack
  // can be popped.
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
                              padding: EdgeInsets.only(bottom: 60, left: 14, right: 14),
                              child: Text(
                                title,
                                style: TextStyle(
                                  color:
                                      Theme.of(context).colorScheme.onBackground.withOpacity(expandedPercent),
                                  overflow: TextOverflow.ellipsis,
                                  fontSize: 27 + expandedPercent * 2,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      SearchBar(
                          autoLeading: autoLeading,
                          popup: popup,
                          heroTag: heroTag,
                          searchController: searchController),
                    ],
                  );
                },
              ),
            ),
          ),
        ];
      },
      body: onRefresh != null
          ? RefreshIndicator(
              onRefresh: onRefresh!,
              edgeOffset: 55,
              color: Theme.of(context).colorScheme.onBackground,
              strokeWidth: 2.5,
              child: LayoutBuilder(
                builder: (BuildContext context, BoxConstraints constraints) {
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
            )
          : LayoutBuilder(
              builder: (BuildContext context, BoxConstraints constraints) {
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
    );
  }
}

// Widget representing a search bar.
// As arguemnts it takes option to show
// a back arrow button, popup and a search controller
// that will be used at a search page when bar
// is pressed.
class SearchBar extends StatelessWidget {
  const SearchBar(
      {Key? key, this.autoLeading = true, this.popup, this.searchController, this.heroTag = 'search'})
      : super(key: key);

  final bool autoLeading;
  final KeeperPopup? popup;
  final BaseSearchController? searchController;
  final String heroTag;

  // Simple function checking if navigation stack
  // can be popped.
  bool canPop(BuildContext context) {
    final NavigatorState? navigator = Navigator.maybeOf(context);
    return navigator != null && navigator.canPop() && autoLeading;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: EdgeInsets.fromLTRB(8, 0, 8, 10),
        child: Hero(
          tag: heroTag,
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
                          color: Theme.of(context).colorScheme.onBackground.withOpacity(0.75),
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
