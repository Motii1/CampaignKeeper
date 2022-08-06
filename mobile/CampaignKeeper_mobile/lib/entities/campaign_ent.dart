import 'dart:convert';
import 'package:campaign_keeper_mobile/entities/base_entity.dart';
import 'package:flutter/material.dart';

// Entity representing an campaign.
class CampaignEntity implements BaseEntity {
  CampaignEntity({required this.id, required this.name, required this.createdAt, String? imageData}) {
    this.imageData = imageData;
  }

  CampaignEntity.fromMap(Map data) {
    id = data['id'];
    name = data['name'];
    createdAt = DateTime.parse(data['createdAt']);
    imageData = data['imageBase64'];
  }

  static const String endpoint = '/api/campaign/list';
  static const String tableName = 'campaigns';

  late int id;
  late String name;
  late DateTime createdAt;

  Image _imageCache = Image.asset("assets/campaign_default.png");
  String? _imageData;

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

  Map<String, Object?> toMap() {
    Map<String, Object?> data = {
      "id": id,
      "name": name,
      "createdAt": createdAt.toString(),
      "imageBase64": imageData,
    };

    return data;
  }

  bool equals(Object? other) {
    if (other == null || !(other is CampaignEntity)) {
      return false;
    }

    return id == other.id &&
        name == other.name &&
        createdAt == other.createdAt &&
        imageData == other.imageData;
  }
}
