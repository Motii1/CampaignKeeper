import 'package:campaign_keeper_mobile/types/widget_types.dart';
import 'package:flutter/material.dart';

// Simple interactive viewer that lets move
// drag and scale it's content.
class KeeperInteractiveViewer extends StatefulWidget {
  const KeeperInteractiveViewer({Key? key, required this.child, required this.centerKey}) : super(key: key);
  final Widget child;
  final GlobalKey centerKey;

  @override
  State<KeeperInteractiveViewer> createState() => _KeeperInteractiveViewerState();
}

class _KeeperInteractiveViewerState extends State<KeeperInteractiveViewer> with WidgetsBindingObserver {
  final controller = TransformationController();
  var opacity = 0.0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance?.addPostFrameCallback((_) {
      var bounds = widget.centerKey.globalPaintBounds;
      if (bounds != null) {
        double posY = bounds.left;
        double widgetWidth = widget.centerKey.currentContext!.size!.width;
        double screenWidth = MediaQuery.of(context).size.width;

        double padding = (screenWidth - widgetWidth) / 2 - 3;
        double deltaY = posY - padding;

        controller.value = Matrix4.translationValues(-deltaY, 80, 0);

        setState(() {
          opacity = 1.0;
        });
      }
    });
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedOpacity(
      opacity: opacity,
      duration: Duration(milliseconds: 250),
      child: InteractiveViewer(
        constrained: false,
        boundaryMargin: EdgeInsets.all(double.infinity),
        minScale: 0.5,
        maxScale: 2.0,
        child: widget.child,
        transformationController: controller,
      ),
    );
  }
}
