import 'package:flutter/material.dart';

class KeeperFadeIn extends StatefulWidget {
  final Duration duration;
  final Widget child;

  const KeeperFadeIn({Key? key, required this.duration, required this.child}) : super(key: key);

  @override
  State<KeeperFadeIn> createState() => _KeeperFadeInState();
}

class _KeeperFadeInState extends State<KeeperFadeIn> with TickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    duration: widget.duration,
    vsync: this,
  )..forward();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      child: widget.child,
      builder: (BuildContext context, Widget? child) {
        return Opacity(
          opacity: _controller.value,
          child: child,
        );
      },
    );
  }
}
