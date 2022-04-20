import 'dart:math';
import 'package:flutter/material.dart';

class KeeperInteractiveViewer extends StatefulWidget {
  const KeeperInteractiveViewer({Key? key, required this.child}) : super(key: key);
  final Widget child;

  @override
  State<KeeperInteractiveViewer> createState() => _KeeperInteractiveViewerState();
}

class _KeeperInteractiveViewerState extends State<KeeperInteractiveViewer> {
  var offset = Offset(-10.0, 90.0); // x, y
  var panOffset = Offset(0.0, 0.0);
  double scale = 1.0;
  double scaleFactor = 1.0;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onScaleStart: (details) {
        panOffset = details.focalPoint;
        scaleFactor = scale;
      },
      onScaleUpdate: (details) {
        panOffset = details.focalPoint;
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
