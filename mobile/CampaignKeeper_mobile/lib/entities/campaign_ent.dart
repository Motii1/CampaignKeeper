import 'dart:typed_data';
import 'package:flutter/material.dart';

class CampaignEntity {
  static const String endpoint = "/api/smh";

  int id;
  String name;
  Uint8List? imageData;

  CampaignEntity({required this.id, required this.name, this.imageData});

  Image get image {
    if (imageData == null) {
      return Image.asset("assets/campaign_default.jpg");
    } else {
      return Image.memory(imageData!);
    }
  }
}