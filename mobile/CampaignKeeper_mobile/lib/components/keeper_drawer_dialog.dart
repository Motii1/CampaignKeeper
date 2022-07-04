import 'package:campaign_keeper_mobile/components/tiles/keeper_title_tile.dart';
import 'package:flutter/material.dart';
import 'dart:math';

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
  final headerKey = GlobalKey();
  final listKey = GlobalKey();
  final scrollController = ScrollController();
  bool isHeaderElevated = false;
  double fillerSize = 0;
  late double topPadding = MediaQuery.of(context).padding.top + 35;
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

  double get drawerHeight {
    return (headerKey.currentContext?.size?.height ?? 0) + (listKey.currentContext?.size?.height ?? 0);
  }

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

  void scrollListener() {
    if (scrollController.position.atEdge && scrollController.position.pixels == 0 && isHeaderElevated) {
      setState(() {
        isHeaderElevated = false;
      });
    } else if (!scrollController.position.atEdge && !isHeaderElevated) {
      setState(() {
        isHeaderElevated = true;
      });
    }
  }

  void onDragUpdate(DragUpdateDetails details) {
    double maxHeight = MediaQuery.of(context).size.height;
    double delta = details.primaryDelta ?? 0;

    if (!isDrawerOpen) return;

    if (delta > 0 && fillerSize == 0 || delta < 0 && drawerController.value < 1) {
      drawerController.value -= delta / maxHeight;

      if (fillerSize != 0) {
        setState(() {
          fillerSize = 0;
        });
      }
    } else {
      double newFillerSize = fillerSize - delta;
      newFillerSize = max(0, newFillerSize);
      newFillerSize = min(maxHeight - topPadding - drawerHeight, newFillerSize);

      setState(() {
        fillerSize = newFillerSize;
      });
    }
  }

  void onDragEnd(DragEndDetails details) {
    double velocity = details.primaryVelocity ?? 0;

    if (!isDrawerOpen) return;

    if (fillerSize > 0) {
      Future.delayed(Duration(milliseconds: 40), (() {
        setState(() {
          fillerSize = 0;
        });
      }));
    } else if (velocity < 250 && drawerController.value > 0.89) {
      int value = (drawerHeight * (1.0 - drawerController.value)).toInt() * 4;
      drawerController.animateTo(1.0, duration: Duration(milliseconds: value));
    } else {
      widget.controller.closeDrawer();
    }
  }

  void onDragCancel() {
    int value = (drawerHeight * (1.0 - drawerController.value)).toInt() * 4;
    drawerController.animateTo(1.0, duration: Duration(milliseconds: value));
  }

  Future<bool> onWillPop() async {
    if (isDrawerOpen) {
      widget.controller.closeDrawer();
      return false;
    } else {
      return true;
    }
  }

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(drawerListener);
    scrollController.addListener(scrollListener);
  }

  @override
  void dispose() {
    widget.controller.removeListener(drawerListener);
    scrollController.removeListener(scrollListener);
    drawerController.stop();
    drawerController.dispose();
    scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: onWillPop,
      child: Stack(
        alignment: AlignmentDirectional.bottomCenter,
        fit: StackFit.expand,
        children: [
          Container(
            color: Theme.of(context).brightness == Brightness.light ? Colors.black : Colors.white,
          ),
          AnimatedOpacity(
            duration: const Duration(milliseconds: 190),
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
            child: Align(
              alignment: Alignment.bottomCenter,
              child: GestureDetector(
                onVerticalDragUpdate: onDragUpdate,
                onVerticalDragEnd: onDragEnd,
                onVerticalDragCancel: onDragCancel,
                child: ConstrainedBox(
                  constraints: BoxConstraints(
                    minHeight: 250,
                    maxHeight: MediaQuery.of(context).size.height - topPadding,
                  ),
                  child: Material(
                    color: Theme.of(context).colorScheme.background,
                    borderRadius:
                        const BorderRadius.only(topLeft: Radius.circular(20), topRight: Radius.circular(20)),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _DrawerHeader(
                          key: headerKey,
                          title: title,
                          isElevated: isHeaderElevated,
                        ),
                        Flexible(
                          key: listKey,
                          child: _DrawerList(
                            drawerController: drawerController,
                            scrollController: scrollController,
                            onDragUpdate: onDragUpdate,
                            onDragEnd: onDragEnd,
                            itemCount: itemCount,
                            builder: builder,
                          ),
                        ),
                        AnimatedSize(
                          duration: const Duration(milliseconds: 250),
                          child: SizedBox(
                            height: fillerSize,
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
    );
  }
}

class _DrawerList extends StatefulWidget {
  final AnimationController drawerController;
  final ScrollController scrollController;
  final void Function(DragUpdateDetails) onDragUpdate;
  final void Function(DragEndDetails) onDragEnd;
  final int itemCount;
  final KeeperDrawerTile Function(BuildContext, int) builder;

  const _DrawerList({
    Key? key,
    required this.drawerController,
    required this.scrollController,
    required this.onDragUpdate,
    required this.onDragEnd,
    required this.itemCount,
    required this.builder,
  }) : super(key: key);

  @override
  State<_DrawerList> createState() => __DrawerListState();
}

class __DrawerListState extends State<_DrawerList> {
  double scrollOffset = 0;
  bool isScrolling = false;

  void onDragStart(DragStartDetails details) {
    scrollOffset = widget.scrollController.offset;
    isScrolling = false;
  }

  void onDragUpdate(DragUpdateDetails details) {
    double delta = details.primaryDelta ?? 0;

    if (!isScrolling &&
        ((widget.scrollController.offset == 0 && delta >= 0) ||
            ((widget.drawerController.value != 1.0 ||
                    widget.scrollController.offset == widget.scrollController.position.maxScrollExtent) &&
                delta <= 0))) {
      widget.onDragUpdate(details);
    } else {
      isScrolling = true;
      scrollOffset = max(0, min(scrollOffset - delta, widget.scrollController.position.maxScrollExtent));
      widget.scrollController.jumpTo(scrollOffset);
    }
  }

  void onDragEnd(DragEndDetails details) {
    if ((widget.drawerController.value != 1.0 || widget.scrollController.position.atEdge) && !isScrolling) {
      widget.onDragEnd(details);
    } else {
      double velocity = details.primaryVelocity ?? 0;
      double direction = velocity > 0 ? 1 : -1;
      double delta = max(0, velocity.abs() - 180) * direction / 15;

      if (scrollOffset != 0 || delta > 0) {
        scrollOffset = max(widget.scrollController.position.minScrollExtent,
            min(scrollOffset - delta, widget.scrollController.position.maxScrollExtent));
        widget.scrollController
            .animateTo(scrollOffset, duration: Duration(milliseconds: 120), curve: Curves.decelerate);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onVerticalDragStart: onDragStart,
      onVerticalDragUpdate: onDragUpdate,
      onVerticalDragEnd: onDragEnd,
      child: ListView.builder(
        controller: widget.scrollController,
        physics: NeverScrollableScrollPhysics(),
        shrinkWrap: true,
        padding: EdgeInsets.zero,
        itemCount: widget.itemCount,
        itemBuilder: widget.builder,
      ),
    );
  }
}

class _DrawerHeader extends StatelessWidget {
  final String title;
  final bool isElevated;

  const _DrawerHeader({Key? key, required this.title, required this.isElevated}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      animationDuration: Duration(milliseconds: 450),
      color: Theme.of(context).colorScheme.background,
      borderRadius: const BorderRadius.only(topLeft: Radius.circular(20), topRight: Radius.circular(20)),
      elevation: isElevated ? 5 : 0,
      shadowColor: Theme.of(context).colorScheme.brightness == Brightness.light
          ? Colors.black.withOpacity(0.2)
          : Colors.white.withOpacity(0.1),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _DrawerHandler(),
          KeeperTitleTile(title: title),
        ],
      ),
    );
  }
}

class _DrawerHandler extends StatelessWidget {
  const _DrawerHandler({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 13, bottom: 9),
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
