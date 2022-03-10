import 'dart:convert';
import 'package:flutter/material.dart';

class CampaignEntity {
  static const String endpoint = "/api/campaign/list";

  int id;
  String name;
  DateTime createdAt;
  String? imageData;

  CampaignEntity({required this.id, required this.name, required this.createdAt, this.imageData});

  Image get image {
    if (imageData == null) {
      return Image.asset("assets/campaign_default.jpg");
    } else {
      return Image.memory(base64.decode(imageData!));
    }
  }
}
