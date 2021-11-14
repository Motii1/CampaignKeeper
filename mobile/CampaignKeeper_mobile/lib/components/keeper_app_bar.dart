import 'package:flutter/material.dart';

class KeeperAppBar extends StatelessWidget {
  KeeperAppBar({Key? key, this.backgroundColor, required this.title, required this.sliver}) : super(key: key);

  final String title;
  final Widget sliver;
  final Color? backgroundColor;

  @override
  Widget build(BuildContext context) {
    Color _bgColor = backgroundColor == null ? Theme.of(context).colorScheme.background : backgroundColor!;

    return NotificationListener<OverscrollIndicatorNotification>(
      onNotification: (overScroll) {
        overScroll.disallowGlow();
        return false;
      },
      child: NestedScrollView(
        headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
          return [
            SliverOverlapAbsorber(
              handle:
              NestedScrollView.sliverOverlapAbsorberHandleFor(context),
              sliver: SliverAppBar(
                pinned: true,
                expandedHeight: 160,
                backgroundColor: _bgColor,
                flexibleSpace: FlexibleSpaceBar(
                  title: Text(
                    title,
                    style: TextStyle(
                      color: Theme.of(context).appBarTheme.titleTextStyle!.color,
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
                  handle: NestedScrollView.sliverOverlapAbsorberHandleFor(
                      context),
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
