import 'package:campaign_keeper_mobile/components/app_bar/keeper_back_button.dart';
import 'package:campaign_keeper_mobile/services/search_controllers/base_search_controller.dart';
import 'package:flutter/material.dart';

class Search extends StatefulWidget {
  const Search({Key? key, required this.searchController}) : super(key: key);
  final BaseSearchController searchController;

  @override
  State<Search> createState() => _SearchState();
}

class _SearchState extends State<Search> {
  final searchTextController = TextEditingController();
  final searchFocusNode = FocusNode();

  List entities = [];

  void onSearchChanged(String input) {
    setState(() {
      if (input.length < 2) {
        entities.clear();
      } else {
        entities = widget.searchController.filterEntities(input);
      }
    });
  }

  // @override
  // void initState() {
  //   super.initState();
  //   WidgetsBinding.instance?.addPostFrameCallback((_) {
  //     Future.delayed(Duration(milliseconds: 400), () {
  //       searchFocusNode.requestFocus();
  //     });
  //   });
  // }

  @override
  Widget build(BuildContext context) {
    return _SearchScaffold(
      searchTextController: searchTextController,
      searchFocusNode: searchFocusNode,
      onChanged: onSearchChanged,
      onClear: () {
        searchTextController.clear();
        setState(() {
          entities.clear();
        });
      },
      body: entities.length == 0
          ? Center(
              child: Text(
                "Be brave and search for treasures",
                textAlign: TextAlign.center,
              ),
            )
          : ListView.builder(
              itemCount: entities.length,
              itemBuilder: (context, id) {
                return widget.searchController.createWidget(entities[id]);
              },
            ),
    );
  }
}

class _SearchScaffold extends StatelessWidget {
  _SearchScaffold(
      {Key? key,
      required this.body,
      required this.searchTextController,
      required this.searchFocusNode,
      required this.onChanged,
      required this.onClear})
      : super(key: key);
  final body;
  final searchTextController;
  final searchFocusNode;
  final void Function(String) onChanged;
  final void Function() onClear;
  final border = OutlineInputBorder(
      borderSide: BorderSide.none, borderRadius: BorderRadius.all(Radius.circular(6)), gapPadding: 0);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        flexibleSpace: Hero(
          tag: 'search',
          flightShuttleBuilder: (flightContext, animation, flightDirection, fromHeroContext, toHeroContext) {
            animation.addStatusListener((status) {
              if (status == AnimationStatus.completed) {
                Future.delayed(Duration(milliseconds: 50), () {
                  searchFocusNode.requestFocus();
                });
              }
            });
            final Hero toHero = toHeroContext.widget as Hero;
            return toHero.child;
          },
          child: Material(
            color: Theme.of(context).colorScheme.surface,
            child: InkWell(
              child: SafeArea(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    KeeperBackButton(),
                    Expanded(
                      child: Center(
                        child: TextField(
                          controller: searchTextController,
                          focusNode: searchFocusNode,
                          style: TextStyle(
                            fontSize: 20,
                          ),
                          onChanged: onChanged,
                          decoration: InputDecoration(
                            hintText: "Search",
                            hintStyle: TextStyle(
                                color: Theme.of(context).appBarTheme.titleTextStyle!.color!.withOpacity(0.7)),
                            fillColor: Colors.transparent,
                            contentPadding: EdgeInsets.all(0),
                            focusedBorder: border,
                            enabledBorder: border,
                            disabledBorder: border,
                            border: border,
                          ),
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: onClear,
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      icon: Icon(
                        Icons.clear,
                        color: Theme.of(context).appBarTheme.titleTextStyle!.color,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
      body: body,
    );
  }
}
