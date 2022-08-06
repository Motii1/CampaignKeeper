import 'package:campaign_keeper_mobile/components/tiles/keeper_object_grid_tile.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/material.dart';

class KeeperObjectsGrid extends StatelessWidget {
  const KeeperObjectsGrid({Key? key, required this.tiles}) : super(key: key);

  final List<KeeperObjectGridTile> tiles;

  Tuple<List<Widget>, List<Widget>> orderWidgets() {
    List<Widget> leftColumn = [];
    List<Widget> rightColumn = [];
    int leftSize = 0;
    int rightSize = 0;

    tiles.forEach(
      (tile) {
        if (leftSize <= rightSize) {
          leftColumn.add(tile);
          leftSize += tile.hasImage ? 3 : 1;
        } else {
          rightColumn.add(tile);
          rightSize += tile.hasImage ? 3 : 1;
        }
      },
    );

    return Tuple(first: leftColumn, second: rightColumn);
  }

  @override
  Widget build(BuildContext context) {
    var widgetColumns = orderWidgets();

    return SliverList(
      delegate: SliverChildListDelegate.fixed(
        [
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 5),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: widgetColumns.first,
                  ),
                ),
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: widgetColumns.second,
                  ),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}
