import 'dart:convert';
import 'package:flutter/material.dart';

// Entity representing an campaign.
class CampaignEntity {
  static const String endpoint = "/api/campaign/list";

  Image _imageCache = Image.asset("assets/campaign_default.png");
  String? _imageData;

  int id;
  String name;
  DateTime createdAt;

  CampaignEntity({required this.id, required this.name, required this.createdAt, String? imageData}) {
    this.imageData = imageData;
  }

  String? get imageData => _imageData;

  // A setter that also updates an cached image.
  set imageData(String? value) {
    _imageData = value;

    if (value != null) {
      _imageCache = Image.memory(
        base64.decode(value),
        gaplessPlayback: true,
      );
    }
  }

  Image get image => _imageCache;

  bool equals(CampaignEntity other) {
    return id == other.id &&
        name == other.name &&
        createdAt == other.createdAt &&
        imageData == other.imageData;
  }
}
