import 'dart:convert';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/material.dart';

class ObjectEntity {
  static const String endpoint = "api/object/list";

  int id;
  int schemaId;
  String title;
  List<FieldValue> fields;

  Image? _imageCache;
  String? _imageData;

  ObjectEntity(
      {required this.id,
      required this.schemaId,
      required this.title,
      required this.fields,
      String? imageData}) {
    this.imageData = imageData;
  }

  String? get imageData => _imageData;

  void set imageData(String? value) {
    _imageData = value == "" ? null : value;

    if (_imageData != null) {
      _imageCache = Image.memory(
        base64.decode(_imageData!),
        gaplessPlayback: true,
      );
    } else {
      _imageCache = null;
    }
  }

  Image? get image => _imageCache;
}
