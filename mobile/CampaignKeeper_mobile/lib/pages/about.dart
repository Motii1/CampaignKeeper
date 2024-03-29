import 'package:campaign_keeper_mobile/components/app_bar/keeper_app_bar.dart';
import 'package:campaign_keeper_mobile/components/keeper_scaffold.dart';
import 'package:campaign_keeper_mobile/components/keeper_logo_card.dart';
import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:flutter/material.dart';

// Simple page representing an about screen.
class About extends StatefulWidget {
  const About({Key? key}) : super(key: key);

  @override
  _AboutState createState() => _AboutState();
}

class _AboutState extends State<About> {
  @override
  Widget build(BuildContext context) {
    return KeeperScaffold(
      body: KeeperAppBar(
        title: "About",
        sliver: SliverFillRemaining(
          hasScrollBody: false,
          child: Center(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(0, 0, 0, 70),
              child: SingleChildScrollView(
                child: KeeperLogoCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        height: 10,
                      ),
                      Text(
                        "Version: ${AppPrefs().milestone}",
                        style: Theme.of(context).textTheme.bodyText1,
                      ),
                      SizedBox(
                        height: 5,
                      ),
                      Text(
                        "Authors:",
                        style: Theme.of(context).textTheme.bodyText1,
                      ),
                      SizedBox(
                        height: 5,
                      ),
                      Text(
                        "• Dawid Motak",
                        style: Theme.of(context).textTheme.bodyText1,
                      ),
                      SizedBox(
                        height: 5,
                      ),
                      Text(
                        "• Przemysław Stasiuk",
                        style: Theme.of(context).textTheme.bodyText1,
                      ),
                      SizedBox(
                        height: 5,
                      ),
                      Text(
                        "• Michał Wójtowicz",
                        style: Theme.of(context).textTheme.bodyText1,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
