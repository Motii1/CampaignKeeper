import 'dart:math';
import 'package:flutter/material.dart';

// Simple interactive viewer that lets move
// drag and scale it's content.
class KeeperInteractiveViewer extends StatefulWidget {
  const KeeperInteractiveViewer({Key? key, required this.child}) : super(key: key);
  final Widget child;

  @override
  State<KeeperInteractiveViewer> createState() => _KeeperInteractiveViewerState();
}

class _KeeperInteractiveViewerState extends State<KeeperInteractiveViewer> {
  var offset = Offset(-10.0, 90.0); // x, y
  double scale = 1.0;
  double scaleFactor = 1.0;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onScaleStart: (details) {
        scaleFactor = scale;
      },
      onScaleUpdate: (details) {
        setState(() {
          scale = min(3.0, max(0.5, scaleFactor * details.scale));
          offset = offset.translate(details.focalPointDelta.dx, details.focalPointDelta.dy);
        });
      },
      child: Container(
        color: Theme.of(context).colorScheme.background,
        child: OverflowBox(
          alignment: Alignment.topCenter,
          minWidth: 0.0,
          minHeight: 0.0,
          maxWidth: double.infinity,
          maxHeight: double.infinity,
          child: Transform.translate(
            offset: offset,
            child: Transform.scale(
              scale: scale,
              child: widget.child,
            ),
          ),
        ),
      ),
    );
  }
}
