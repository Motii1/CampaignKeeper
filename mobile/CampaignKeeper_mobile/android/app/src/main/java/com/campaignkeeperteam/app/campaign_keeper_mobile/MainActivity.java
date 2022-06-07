package com.campaignkeeperteam.app.campaign_keeper_mobile;

import android.content.Context;
import android.widget.Toast;
import androidx.annotation.NonNull;
import io.flutter.embedding.android.FlutterActivity;
import io.flutter.embedding.engine.FlutterEngine;
import io.flutter.plugin.common.MethodChannel;

public class MainActivity extends FlutterActivity {
    private static final String CHANNEL = "com.campaignkeeperteam.app.campaign_keeper_mobile/toast";

    @Override
    public void configureFlutterEngine(@NonNull FlutterEngine flutterEngine) {
    super.configureFlutterEngine(flutterEngine);
        new MethodChannel(flutterEngine.getDartExecutor().getBinaryMessenger(), CHANNEL)
            .setMethodCallHandler(
                (call, result) -> {
                // Note: this method is invoked on the main thread.
                    if (call.method.equals("keeperShowToast") && call.argument("text") != null) {
                        keeperShowToast(call.argument("text"));

                        result.success(null);
                    } else {
                        result.notImplemented();
                    }
                }
            );
    }

    private void keeperShowToast(String text) {
        Context context = getApplicationContext();
        int duration = Toast.LENGTH_SHORT;

        Toast.makeText(context, text, duration).show();
    }
}
