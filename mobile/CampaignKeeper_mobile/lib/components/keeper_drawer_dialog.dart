import 'package:campaign_keeper_mobile/components/tiles/keeper_title_tile.dart';
import 'package:flutter/material.dart';

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
  final drawerKey = GlobalKey();
  final stackKey = GlobalKey();
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
      controller.value -= (details.primaryDelta ?? 0) / maxHeight;
    }
  }

  void onDragEnd(DragEndDetails details) {
    double drawerHeight = drawerKey.currentContext?.size?.height ?? 400;

    if (controller.value > 1.0 - 60 / drawerHeight) {
      int value = (drawerHeight * (1.0 - controller.value)).toInt() * 4;
      controller.animateTo(1.0, duration: Duration(milliseconds: value));
    } else {
      widget.controller.closeDrawer();
    }
  }

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(drawerListener);
  }

  @override
  void dispose() {
    widget.controller.removeListener(drawerListener);
    controller.dispose();
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
                height: MediaQuery.of(context).padding.top + 30,
              ),
              Flexible(
                child: Align(
                  alignment: Alignment.bottomCenter,
                  child: GestureDetector(
                    onVerticalDragUpdate: onDragUpdate,
                    onVerticalDragEnd: onDragEnd,
                    child: Material(
                      key: drawerKey,
                      color: Theme.of(context).colorScheme.background,
                      borderRadius:
                          BorderRadius.only(topLeft: Radius.circular(20), topRight: Radius.circular(20)),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          _DrawerHandler(),
                          KeeperTitleTile(title: title),
                          Flexible(
                            child: ListView(
                              shrinkWrap: true,
                              padding: EdgeInsets.zero,
                              children: items,
                            ),
                          ),
                        ],
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
      padding: EdgeInsets.only(top: 14, bottom: 10),
      child: Center(
        child: Material(
          color: Theme.of(context).colorScheme.onBackground,
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
