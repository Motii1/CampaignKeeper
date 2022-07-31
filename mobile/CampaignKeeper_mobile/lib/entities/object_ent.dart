import 'dart:convert';
import 'package:campaign_keeper_mobile/entities/base_entity.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/material.dart';

// Entity representing an object.
class ObjectEntity implements BaseEntity {
  ObjectEntity(
      {required this.id,
      required this.schemaId,
      required this.title,
      required this.values,
      String? imageData}) {
    this.imageData = imageData;
  }

  ObjectEntity.fromMap(Map data) {
    id = data['id'];
    schemaId = data['schemaId'];
    title = data['title'];
    imageData = data['imageBase64'];
    values = (data['metadataArray'] as List<dynamic>).map((e) => FieldValue.decode(e)).toList();
  }

  static const String endpoint = "/api/object/list";

  late int id;
  late int schemaId;
  late String title;
  late List<FieldValue> values;

  Image? _imageCache;
  String? _imageData;

  String? get imageData => _imageData;

  // A setter that also updates the cached image.
  set imageData(String? value) {
    _imageData = value == "" ? null : value;

    if (_imageData != null) {
      _imageCache = Image.memory(
        base64.decode(_imageData!),
        gaplessPlayback: true,
        width: double.infinity,
        fit: BoxFit.fitWidth,
      );
    } else {
      _imageCache = null;
    }
  }

  Image? get image => _imageCache;

  Map toMap() {
    Map data = {
      'id': id,
      'schemaId': schemaId,
      'title': title,
      'imageBase64': imageData,
      'metadataArray': values.map((e) => FieldValue.encode(e)).toList(),
    };

    return data;
  }

  bool equals(Object? other) {
    if (other == null || !(other is ObjectEntity)) {
      return false;
    }

    return id == other.id &&
        schemaId == other.schemaId &&
        title == other.title &&
        imageData == other.imageData &&
        values.equals(other.values);
  }
}
