import 'package:flutter/material.dart';

class KeeperPopUp extends StatelessWidget {
  KeeperPopUp({Key? key, required this.itemBuilder, this.onSelected})
      : super(key: key);

  final List<PopupMenuEntry<dynamic>> Function(BuildContext) itemBuilder;
  final void Function(dynamic)? onSelected;

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton(
      itemBuilder: itemBuilder,
      onSelected: onSelected,
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
      required this.sliver})
      : super(key: key);

  final String title;
  final Widget sliver;
  final Color? backgroundColor;
  final List<PopupMenuEntry<dynamic>> Function(BuildContext)? popupItemBuilder;
  final void Function(dynamic)? popupOnSelected;

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
                actions: (popupItemBuilder == null)
                    ? null
                    : [KeeperPopUp(itemBuilder: popupItemBuilder!)],
                pinned: true,
                collapsedHeight: 58.4,
                expandedHeight: 160,
                backgroundColor: _bgColor,
                flexibleSpace: FlexibleSpaceBar(
                  title: Text(
                    title,
                    style: TextStyle(
                      color:
                          Theme.of(context).appBarTheme.titleTextStyle!.color,
                    ),
                  ),
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
