import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/material.dart';

// Controller for KeeperAnimatedSliverReplacer that allows for interaction.
class KeeperSliverReplacerController extends ChangeNotifier {
  var _type = KeeperSliverReplacerType.Animate;
  Widget? _awaitingWidget;

  Widget? get awaitingWidget => _awaitingWidget;

  KeeperSliverReplacerType get type => _type;

  // Notifies all subscribers that they should replace
  // their children with an animation.
  void replace(Widget child) {
    _type = KeeperSliverReplacerType.Animate;
    _awaitingWidget = child;
    notifyListeners();
  }

  // Notifies all subscribers that they should replace
  // their children without an animation.
  void replaceInstant(Widget child) {
    _type = KeeperSliverReplacerType.Instant;
    _awaitingWidget = child;
    notifyListeners();
  }
}

// Widget that allows to replace their sliver child with a fade out/in animation.
class KeeperAnimatedSliverReplacer extends StatefulWidget {
  KeeperAnimatedSliverReplacer({Key? key, required this.controller, required this.sliver}) : super(key: key);

  final KeeperSliverReplacerController controller;
  final Widget sliver;

  @override
  State<KeeperAnimatedSliverReplacer> createState() => _KeeperAnimatedSliverReplacerState();
}

class _KeeperAnimatedSliverReplacerState extends State<KeeperAnimatedSliverReplacer>
    with SingleTickerProviderStateMixin {
  late Widget child = widget.sliver;
  late final AnimationController controller = AnimationController(
    value: 1.0,
    duration: const Duration(milliseconds: 140),
    vsync: this,
  );
  late final Animation<double> animation = CurvedAnimation(
    parent: controller,
    curve: Curves.easeIn,
  );

  void _onControllerChanged() {
    var awaitingWidget = widget.controller.awaitingWidget;

    if (awaitingWidget != null) {
      if (widget.controller.type == KeeperSliverReplacerType.Animate) {
        controller.reverse();
      } else {
        setState(() {
          child = awaitingWidget;
        });
      }
    }
  }

  @override
  void initState() {
    super.initState();

    animation.addStatusListener((status) {
      if (status == AnimationStatus.dismissed) {
        var awaitingWidget = widget.controller.awaitingWidget;

        if (awaitingWidget != null) {
          setState(() {
            child = awaitingWidget;
          });
        }

        controller.forward();
      }
    });

    widget.controller.addListener(_onControllerChanged);
  }

  @override
  void dispose() {
    widget.controller.removeListener(_onControllerChanged);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SliverFadeTransition(
      opacity: animation,
      sliver: child,
    );
  }
}
