import 'package:campaign_keeper_mobile/components/tiles/keeper_title_tile.dart';
import 'package:flutter/material.dart';
import 'dart:math';

// IN PROGRESS
class KeeperDrawerDialogController extends ChangeNotifier {
  bool _isDrawerOpen = false;
  String _title = "";
  List<KeeperDrawerTile> _items = [];

  bool get isDrawerOpen => _isDrawerOpen;
  String get title => _title;
  List<KeeperDrawerTile> get items => _items;

  void openDrawer(String title, List<KeeperDrawerTile> items) {
    _isDrawerOpen = true;
    _title = title;
    _items = items;
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
        context.findAncestorWidgetOfExactType<KeeperDrawerDialog>()?.controller.closeDrawer();

        if (onTap != null) {
          onTap!();
        }
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
  static const shadowDuration = Duration(milliseconds: 200);
  final scrollController = ScrollController();
  final drawerKey = GlobalKey();
  final stackKey = GlobalKey();
  double scrollOffset = 0;
  bool isScrolling = false;
  late bool isDrawerOpen = widget.controller.isDrawerOpen;
  late String title = widget.controller.title;
  late List<KeeperDrawerTile> items = widget.controller.items;

  late final controller = AnimationController(
    vsync: this,
    duration: Duration(milliseconds: 250),
  );
  late final offsetAnimation = Tween<Offset>(
    begin: Offset(0.0, 1.0),
    end: Offset.zero,
  ).animate(controller);

  void drawerListener() {
    setState(() {
      isDrawerOpen = widget.controller.isDrawerOpen;

      if (isDrawerOpen) {
        title = widget.controller.title;
        items = widget.controller.items;
      }
    });

    if (isDrawerOpen) {
      controller.forward();
    } else {
      controller.reverse();
    }
  }

  void onDragUpdate(DragUpdateDetails details) {
    double maxHeight = stackKey.currentContext?.size?.height ?? MediaQuery.of(context).size.height;
    double drawerHeight = drawerKey.currentContext?.size?.height ?? 400;

    if (details.globalPosition.dy > maxHeight - drawerHeight + 15) {
      controller.value = controller.value - (details.primaryDelta ?? 0) / maxHeight;
    }
  }

  void onDragEnd(DragEndDetails details) {
    double drawerHeight = drawerKey.currentContext?.size?.height ?? 250;

    if ((details.primaryVelocity ?? 0) < 200 && controller.value > 0.89) {
      int value = (drawerHeight * (1.0 - controller.value)).toInt() * 4;
      controller.animateTo(1.0, duration: Duration(milliseconds: value));
    } else {
      widget.controller.closeDrawer();
    }
  }

  void onDragCancel() {
    double drawerHeight = drawerKey.currentContext?.size?.height ?? 400;
    int value = (drawerHeight * (1.0 - controller.value)).toInt() * 4;
    controller.animateTo(1.0, duration: Duration(milliseconds: value));
  }

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(drawerListener);
  }

  @override
  void dispose() {
    widget.controller.removeListener(drawerListener);
    controller.stop();
    controller.dispose();
    scrollController.dispose();
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
                              child: GestureDetector(
                                onVerticalDragStart: ((details) {
                                  scrollOffset = scrollController.offset;
                                  isScrolling = false;
                                }),
                                onVerticalDragUpdate: (details) {
                                  double delta = details.primaryDelta ?? 0;

                                  if (!isScrolling &&
                                      ((scrollController.offset == 0 && delta >= 0) ||
                                          (controller.value != 1.0 && delta <= 0))) {
                                    onDragUpdate(details);
                                  } else {
                                    isScrolling = true;
                                    scrollOffset = max(0,
                                        min(scrollOffset - delta, scrollController.position.maxScrollExtent));
                                    scrollController.jumpTo(scrollOffset);
                                  }
                                },
                                onVerticalDragEnd: (details) {
                                  if (controller.value != 1.0 && !isScrolling) {
                                    onDragEnd(details);
                                  } else {
                                    double delta = (details.primaryVelocity ?? 0) / 7;
                                    scrollOffset = max(0,
                                        min(scrollOffset - delta, scrollController.position.maxScrollExtent));
                                    scrollController.animateTo(scrollOffset,
                                        duration: Duration(milliseconds: 160), curve: Curves.decelerate);
                                  }
                                },
                                child: ListView.builder(
                                  controller: scrollController,
                                  physics: NeverScrollableScrollPhysics(),
                                  shrinkWrap: true,
                                  padding: EdgeInsets.zero,
                                  itemCount: items.length,
                                  itemBuilder: (context, id) => items[id],
                                ),
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

class _DrawerHandler extends StatelessWidget {
  const _DrawerHandler({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(top: 13, bottom: 9),
      child: Center(
        child: Material(
          color: Theme.of(context).colorScheme.onBackground.withOpacity(0.25),
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
