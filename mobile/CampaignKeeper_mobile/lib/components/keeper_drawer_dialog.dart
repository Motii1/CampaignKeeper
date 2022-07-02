import 'package:campaign_keeper_mobile/components/tiles/keeper_title_tile.dart';
import 'package:flutter/material.dart';
import 'dart:math';

// IN PROGRESS
class KeeperDrawerDialogController extends ChangeNotifier {
  bool _isDrawerOpen = false;
  String _title = "";
  KeeperDrawerTile Function(BuildContext, int)? _builder;
  int _itemCount = 0;

  bool get isDrawerOpen => _isDrawerOpen;
  String get title => _title;
  KeeperDrawerTile Function(BuildContext, int)? get builder => _builder;
  int get itemCount => _itemCount;

  void openDrawer(String title, int itemCount, KeeperDrawerTile Function(BuildContext, int) builder) {
    _isDrawerOpen = true;
    _title = title;
    _itemCount = itemCount;
    _builder = builder;
    notifyListeners();
  }

  void closeDrawer() {
    _isDrawerOpen = false;
    notifyListeners();
  }
}

class KeeperDrawerTile extends StatelessWidget {
  const KeeperDrawerTile({Key? key, this.onTap, required this.child}) : super(key: key);
  final Widget child;
  final void Function()? onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: (() {
        Future.delayed(Duration(milliseconds: 100), () {
          context.findAncestorWidgetOfExactType<KeeperDrawerDialog>()?.controller.closeDrawer();

          if (onTap != null) {
            onTap!();
          }
        });
      }),
      child: child,
    );
  }
}

class KeeperDrawerDialog extends StatefulWidget {
  const KeeperDrawerDialog({Key? key, required this.controller, required this.child}) : super(key: key);
  final KeeperDrawerDialogController controller;
  final Widget child;

  @override
  State<KeeperDrawerDialog> createState() => _KeeperDrawerDialogState();
}

class _KeeperDrawerDialogState extends State<KeeperDrawerDialog> with SingleTickerProviderStateMixin {
  static const shadowDuration = Duration(milliseconds: 190);
  final drawerKey = GlobalKey();
  final stackKey = GlobalKey();
  late bool isDrawerOpen = widget.controller.isDrawerOpen;
  late String title = widget.controller.title;
  late int itemCount = widget.controller.itemCount;
  late KeeperDrawerTile Function(BuildContext, int) builder =
      widget.controller.builder ?? (_context, _id) => KeeperDrawerTile(child: Text("Error"));
  late final drawerController = AnimationController(
    vsync: this,
    duration: Duration(milliseconds: 260),
    reverseDuration: Duration(milliseconds: 300),
  );
  late final offsetAnimation = Tween<Offset>(
    begin: Offset(0.0, 1.0),
    end: Offset.zero,
  ).animate(drawerController);

  void drawerListener() {
    if (widget.controller.isDrawerOpen) {
      title = widget.controller.title;
      itemCount = widget.controller.itemCount;
      builder = widget.controller.builder ?? builder;
    }

    setState(() {
      isDrawerOpen = widget.controller.isDrawerOpen;
    });

    if (isDrawerOpen) {
      drawerController.forward();
    } else {
      drawerController.reverse();
    }
  }

  void onDragUpdate(DragUpdateDetails details) {
    double maxHeight = stackKey.currentContext?.size?.height ?? MediaQuery.of(context).size.height;
    double drawerHeight = drawerKey.currentContext?.size?.height ?? 400;

    if (details.globalPosition.dy > maxHeight - drawerHeight + 15) {
      drawerController.value -= (details.primaryDelta ?? 0) / maxHeight;
    }
  }

  void onDragEnd(DragEndDetails details) {
    double drawerHeight = drawerKey.currentContext?.size?.height ?? 250;

    if ((details.primaryVelocity ?? 0) < 200 && drawerController.value > 0.89) {
      int value = (drawerHeight * (1.0 - drawerController.value)).toInt() * 4;
      drawerController.animateTo(1.0, duration: Duration(milliseconds: value));
    } else {
      widget.controller.closeDrawer();
    }
  }

  void onDragCancel() {
    double drawerHeight = drawerKey.currentContext?.size?.height ?? 400;
    int value = (drawerHeight * (1.0 - drawerController.value)).toInt() * 4;
    drawerController.animateTo(1.0, duration: Duration(milliseconds: value));
  }

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(drawerListener);
  }

  @override
  void dispose() {
    widget.controller.removeListener(drawerListener);
    drawerController.stop();
    drawerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      key: stackKey,
      alignment: AlignmentDirectional.bottomCenter,
      fit: StackFit.expand,
      children: [
        Container(
          color: Colors.black,
        ),
        AnimatedOpacity(
          duration: shadowDuration,
          opacity: isDrawerOpen ? 0.8 : 1.0,
          child: widget.child,
        ),
        Visibility(
            visible: isDrawerOpen,
            child: GestureDetector(
              onTap: (() {
                widget.controller.closeDrawer();
              }),
              child: Container(
                color: Colors.transparent,
              ),
            )),
        SlideTransition(
          position: offsetAnimation,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SizedBox(
                height: MediaQuery.of(context).padding.top + 35,
              ),
              Flexible(
                child: Align(
                  alignment: Alignment.bottomCenter,
                  child: GestureDetector(
                    onVerticalDragUpdate: onDragUpdate,
                    onVerticalDragEnd: onDragEnd,
                    onVerticalDragCancel: onDragCancel,
                    child: Material(
                      key: drawerKey,
                      color: Theme.of(context).colorScheme.background,
                      borderRadius:
                          BorderRadius.only(topLeft: Radius.circular(20), topRight: Radius.circular(20)),
                      child: ConstrainedBox(
                        constraints: BoxConstraints(
                          minHeight: 250,
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            _DrawerHandler(),
                            KeeperTitleTile(title: title),
                            Flexible(
                              child: _DrawerList(
                                drawerController: drawerController,
                                onDragUpdate: onDragUpdate,
                                onDragEnd: onDragEnd,
                                itemCount: itemCount,
                                builder: builder,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _DrawerList extends StatefulWidget {
  final AnimationController drawerController;
  final void Function(DragUpdateDetails) onDragUpdate;
  final void Function(DragEndDetails) onDragEnd;
  final int itemCount;
  final KeeperDrawerTile Function(BuildContext, int) builder;

  const _DrawerList({
    Key? key,
    required this.drawerController,
    required this.onDragUpdate,
    required this.onDragEnd,
    required this.itemCount,
    required this.builder,
  }) : super(key: key);

  @override
  State<_DrawerList> createState() => __DrawerListState();
}

class __DrawerListState extends State<_DrawerList> {
  final scrollController = ScrollController();
  double scrollOffset = 0;
  bool isScrolling = false;

  void onDragStart(DragStartDetails details) {
    scrollOffset = scrollController.offset;
    isScrolling = false;
  }

  void onDragUpdate(DragUpdateDetails details) {
    double delta = details.primaryDelta ?? 0;

    if (!isScrolling &&
        ((scrollController.offset == 0 && delta >= 0) ||
            (widget.drawerController.value != 1.0 && delta <= 0))) {
      widget.onDragUpdate(details);
    } else {
      isScrolling = true;
      scrollOffset = max(0, min(scrollOffset - delta, scrollController.position.maxScrollExtent));
      scrollController.jumpTo(scrollOffset);
    }
  }

  void onDragEnd(DragEndDetails details) {
    if (widget.drawerController.value != 1.0 && !isScrolling) {
      widget.onDragEnd(details);
    } else {
      double delta = ((details.primaryVelocity ?? 0) - 180) / 8;
      scrollOffset = max(0, min(scrollOffset - delta, scrollController.position.maxScrollExtent));
      scrollController.animateTo(scrollOffset,
          duration: Duration(milliseconds: 160), curve: Curves.decelerate);
    }
  }

  @override
  void dispose() {
    scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onVerticalDragStart: onDragStart,
      onVerticalDragUpdate: onDragUpdate,
      onVerticalDragEnd: onDragEnd,
      child: ListView.builder(
        controller: scrollController,
        physics: NeverScrollableScrollPhysics(),
        shrinkWrap: true,
        padding: EdgeInsets.zero,
        itemCount: widget.itemCount,
        itemBuilder: widget.builder,
      ),
    );
  }
}

class _DrawerHandler extends StatelessWidget {
  const _DrawerHandler({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(top: 13, bottom: 9),
      child: Center(
        child: Material(
          color: Theme.of(context).colorScheme.onBackground.withOpacity(0.2),
          borderRadius: BorderRadius.circular(20),
          child: SizedBox(
            height: 5.5,
            width: 55,
          ),
        ),
      ),
    );
  }
}
