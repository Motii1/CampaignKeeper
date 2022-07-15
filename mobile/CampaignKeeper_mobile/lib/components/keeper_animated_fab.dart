import 'package:flutter/material.dart';

class KeeperAnimatedFAB extends StatefulWidget {
  const KeeperAnimatedFAB({Key? key, required this.icon, this.child, this.onPressed}) : super(key: key);

  final Widget icon;
  final Widget? child;
  final void Function()? onPressed;

  @override
  State<KeeperAnimatedFAB> createState() => _KeeperAnimatedFABState();
}

class _KeeperAnimatedFABState extends State<KeeperAnimatedFAB> {
  bool open = true;

  late Widget icon = widget.icon;
  late Widget? child = widget.child;
  late void Function()? onPressed = widget.onPressed;

  bool areDependenciesChanged(KeeperAnimatedFAB oldWidget) {
    return oldWidget.icon != widget.icon || oldWidget.child != widget.child;
  }

  @override
  void didUpdateWidget(KeeperAnimatedFAB oldWidget) {
    super.didUpdateWidget(oldWidget);

    setState(() {
      onPressed = widget.onPressed;
    });

    if (areDependenciesChanged(oldWidget) && open) {
      setState(() {
        open = false;
      });

      Future.delayed(Duration(milliseconds: 200), () async {
        setState(() {
          icon = widget.icon;
          child = widget.child;
          onPressed = widget.onPressed;
          open = true;
        });
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      transformAlignment: Alignment.bottomRight,
      transform: Matrix4.diagonal3Values(
        open ? 1.0 : 0.8,
        open ? 1.0 : 0.8,
        1.0,
      ),
      duration: const Duration(milliseconds: 200),
      curve: Curves.easeOut,
      child: AnimatedOpacity(
        opacity: open ? 1.0 : 0.0,
        curve: Curves.easeInOut,
        duration: const Duration(milliseconds: 200),
        child: FloatingActionButton.extended(
          clipBehavior: Clip.hardEdge,
          onPressed: onPressed,
          icon: icon,
          label: child ?? Text(""),
        ),
      ),
    );
  }
}
