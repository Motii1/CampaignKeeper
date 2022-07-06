import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/components/keeper_drawer_dialog.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/components/tiles/keeper_chip_tile.dart';
import 'package:campaign_keeper_mobile/components/tiles/keeper_field_tile.dart';
import 'package:campaign_keeper_mobile/components/tiles/keeper_text_tile.dart';
import 'package:campaign_keeper_mobile/components/tiles/keeper_title_tile.dart';
import 'package:campaign_keeper_mobile/entities/event_ent.dart';
import 'package:campaign_keeper_mobile/entities/object_ent.dart';
import 'package:campaign_keeper_mobile/entities/session_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/material.dart';
import 'package:visibility_detector/visibility_detector.dart';

// Page displaying a single object.
class EventExplorer extends StatefulWidget {
  const EventExplorer({Key? key, required this.eventId}) : super(key: key);
  final int eventId;

  @override
  State<EventExplorer> createState() => _EventExplorerState();
}

class _EventExplorerState extends KeeperState<EventExplorer> {
  final scrollController = ScrollController();
  final drawerController = KeeperDrawerDialogController();
  final List<FieldValue> characterValues = [];
  final List<FieldValue> placeValues = [];
  final List<FieldValue> descriptionValues = [];
  EventEntity? _event;
  bool isFight = false;

  EventEntity? get event => _event;

  void set event(EventEntity? value) {
    characterValues.clear();
    placeValues.clear();
    descriptionValues.clear();
    _event = value;

    if (value != null) {
      isFight = value.type.toLowerCase() == 'fight';

      var charValues = value.characterValues.where((e) => e.fieldName == 'characters').toList()
        ..sort(((a, b) => a.sequence.compareTo(b.sequence)));
      characterValues.addAll(charValues);

      var plValues = value.placeValues.where((e) => e.fieldName == 'places').toList()
        ..sort(((a, b) => a.sequence.compareTo(b.sequence)));
      placeValues.addAll(plValues);

      var desValues = value.descriptionValues.where((e) => e.fieldName == 'descriptions').toList()
        ..sort(((a, b) => a.sequence.compareTo(b.sequence)));
      descriptionValues.addAll(desValues);
    }
  }

  late SessionEntity? session = DataCarrier().get(entId: event?.sessionId ?? -1);
  bool isTitleVisible = false;
  bool isScrolledToTop = true;

  Future<void> onRefresh() async {
    await Future.wait([
      DataCarrier().refresh<UserDataEntity>(),
      DataCarrier().refresh<SessionEntity>(parameterValue: session?.campaignId),
      DataCarrier().refresh<ObjectEntity>(
          parameterValue: session?.campaignId, parameterName: EntityParameter.campaign),
      DataCarrier().refresh<EventEntity>(parameterValue: session?.id),
    ]);
  }

  Future<void> onEventRefresh() async {
    EventEntity? entity = DataCarrier().get(entId: widget.eventId);

    if (entity == null) {
      returnTo('/start');
    } else {
      setState(() {
        event = entity;
      });
    }
  }

  Future<void> onSessionRefresh() async {
    setState(() {
      session = DataCarrier().get(entId: event?.sessionId ?? -1);
    });
  }

  void scrollListener() {
    if (scrollController.offset <= scrollController.position.minScrollExtent && !isScrolledToTop) {
      setState(() {
        isScrolledToTop = true;
      });
    } else {
      if (scrollController.offset > 5.0 && isScrolledToTop) {
        setState(() {
          isScrolledToTop = false;
        });
      }
    }
  }

  void onButtonPressed(bool isParent) {
    var listIds = (isParent ? event?.parentIds : event?.childrenIds) ?? [];

    if (listIds.length == 1) {
      Navigator.of(context)
          .pushReplacementNamed('/start/campaign/session_map/event_explorer', arguments: listIds[0]);
    } else if (listIds.length > 1) {
      drawerController.openDrawer(
        "Choose event",
        listIds.length,
        (context, id) => KeeperDrawerTile(
          child: ListTile(
            title: Text(DataCarrier().get<EventEntity>(entId: listIds[id])?.title ?? "Error"),
          ),
          onTap: () {
            Navigator.of(context)
                .pushReplacementNamed('/start/campaign/session_map/event_explorer', arguments: listIds[id]);
          },
        ),
      );
    }
  }

  void onPrevPressed() => onButtonPressed(true);

  void onNextPressed() => onButtonPressed(false);

  Widget objectItemBuilder(BuildContext context, int index) {
    if (index == 0) {
      return VisibilityDetector(
        key: Key('event-title'),
        child: KeeperTitleTile(title: event?.title ?? ""),
        onVisibilityChanged: (visibilityInfo) {
          bool shouldTitleBeVisible = visibilityInfo.visibleFraction <= 0.5;

          if (isTitleVisible != shouldTitleBeVisible && this.mounted) {
            setState(() {
              isTitleVisible = shouldTitleBeVisible;
            });
          }
        },
      );
    }

    if (index == 1) {
      return KeeperTextTile(
        fieldName: "Status",
        value: event?.status ?? "",
        isProminent: isFight,
      );
    }

    if (index == 2) {
      return KeeperChipTile(
        fieldName: "Places",
        values: placeValues,
        isProminent: isFight,
      );
    }

    if (index == 3) {
      return KeeperChipTile(
        fieldName: "Characters",
        values: characterValues,
        isProminent: isFight,
      );
    }

    if (index == 4) {
      return KeeperFieldTile(
        fieldName: "Description",
        values: descriptionValues,
        isProminent: isFight,
      );
    }

    return Center(
      child: Text("Error"),
    );
  }

  @override
  void onReturn() async {
    DataCarrier().refresh<SessionEntity>(parameterValue: session?.campaignId);
    DataCarrier()
        .refresh<ObjectEntity>(parameterValue: session?.campaignId, parameterName: EntityParameter.campaign);
    DataCarrier().refresh<EventEntity>(parameterValue: session?.id);
  }

  @override
  void onResume() async {
    onReturn();
  }

  @override
  void initState() {
    super.initState();
    VisibilityDetectorController.instance.updateInterval = Duration(milliseconds: 250);
    scrollController.addListener(scrollListener);
    DataCarrier().addListener<EventEntity>(onEventRefresh);
    DataCarrier().addListener<ObjectEntity>(onEventRefresh);
    DataCarrier().addListener<SessionEntity>(onSessionRefresh);
    event = DataCarrier().get(entId: widget.eventId);
    onReturn();
  }

  @override
  void dispose() {
    scrollController.removeListener(scrollListener);
    scrollController.dispose();
    DataCarrier().removeListener<EventEntity>(onEventRefresh);
    DataCarrier().removeListener<ObjectEntity>(onEventRefresh);
    DataCarrier().removeListener<SessionEntity>(onSessionRefresh);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return KeeperDrawerDialog(
      controller: drawerController,
      child: Scaffold(
        appBar: AppBar(
          title: AnimatedOpacity(
            duration: Duration(milliseconds: 120),
            opacity: isTitleVisible ? 1.0 : 0.0,
            child: Text(event?.title ?? ""),
          ),
          actions: [KeeperPopup.settings(context)],
          elevation: isScrolledToTop ? 0 : 5,
        ),
        body: RefreshIndicator(
          color: Theme.of(context).colorScheme.onBackground,
          strokeWidth: 2.5,
          onRefresh: onRefresh,
          child: ListView.builder(
            physics: AlwaysScrollableScrollPhysics(),
            controller: scrollController,
            itemBuilder: objectItemBuilder,
            itemCount: event != null ? 5 : 1,
          ),
        ),
        bottomNavigationBar: _EventBottomNavigation(
          onPrevPressed: event?.parentIds.isNotEmpty == true ? onPrevPressed : null,
          onNextPressed: event?.childrenIds.isNotEmpty == true ? onNextPressed : null,
        ),
      ),
    );
  }
}

class _EventBottomNavigation extends StatelessWidget {
  final void Function()? onPrevPressed;
  final void Function()? onNextPressed;

  const _EventBottomNavigation({Key? key, this.onPrevPressed, this.onNextPressed}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 70,
      child: Material(
        color: Theme.of(context).colorScheme.surface,
        child: Row(
          children: [
            Expanded(
              child: Padding(
                padding: EdgeInsets.only(left: 10, right: 6),
                child: ElevatedButton(
                  style: ButtonStyle(
                      foregroundColor: MaterialStateProperty.resolveWith<Color?>((states) {
                        var color = Color.alphaBlend(
                            Theme.of(context).colorScheme.onSurface.withOpacity(0.65),
                            Theme.of(context).colorScheme.primary);

                        if (states.contains(MaterialState.disabled)) {
                          color = color.withOpacity(0.7);
                        }

                        return color;
                      }),
                      backgroundColor: MaterialStateProperty.resolveWith<Color?>((states) {
                        var color = Theme.of(context).colorScheme.background;

                        if (states.contains(MaterialState.disabled)) {
                          color = color.withOpacity(0.95);
                        }

                        return color;
                      }),
                      overlayColor: MaterialStateProperty.resolveWith<Color?>(
                          (states) => Theme.of(context).colorScheme.onBackground.withOpacity(0.1))),
                  onPressed: onPrevPressed,
                  child: Text("Previous"),
                ),
              ),
            ),
            Expanded(
              child: Padding(
                padding: EdgeInsets.only(left: 6, right: 10),
                child: ElevatedButton(
                  onPressed: onNextPressed,
                  child: Text("Next"),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
