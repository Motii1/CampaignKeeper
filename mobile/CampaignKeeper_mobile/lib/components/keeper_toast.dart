import 'package:campaign_keeper_mobile/components/keeper_fadein.dart';
import 'package:flutter/material.dart';

class KeeperToast {
  static SnackBar createToast({required BuildContext context, required String message}) {
    return SnackBar(
      content: SizedBox(
        height: 60,
        child: Center(
          child: KeeperFadeIn(
            duration: Duration(milliseconds: 400),
            child: Material(
              color: Theme.of(context).colorScheme.onSurface,
              borderRadius: BorderRadius.circular(35),
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 15, horizontal: 20),
                child: Text(
                  message,
                  textAlign: TextAlign.center,
                  overflow: TextOverflow.ellipsis,
                  textScaleFactor: 1.0,
                  style: TextStyle(
                    fontSize: 16,
                    color: Theme.of(context).colorScheme.surface,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      behavior: SnackBarBehavior.floating,
      dismissDirection: DismissDirection.none,
      duration: Duration(seconds: 1, milliseconds: 500),
      backgroundColor: Colors.transparent,
      elevation: 0,
    );
  }
}
