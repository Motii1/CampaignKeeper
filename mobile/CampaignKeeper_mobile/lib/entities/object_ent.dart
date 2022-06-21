import 'dart:convert';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/material.dart';

class ObjectEntity {
  static const String endpoint = "/api/object/list";

  int id;
  int schemaId;
  String title;
  List<FieldValue> values;

  Image? _imageCache;
  String? _imageData;

  ObjectEntity(
      {required this.id,
      required this.schemaId,
      required this.title,
      required this.values,
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
        width: double.infinity,
        fit: BoxFit.fitWidth,
      );
    } else {
      _imageCache = null;
    }
  }

  Image? get image => _imageCache;

  bool equals(ObjectEntity other) {
    return id == other.id &&
        schemaId == other.schemaId &&
        title == other.title &&
        imageData == other.imageData &&
        _valuesEquals(other.values);
  }

  bool _valuesEquals(List<FieldValue> other) {
    if (values.length == other.length) {
      for (int i = 0; i < values.length; i++) {
        if (!values[i].equals(other[i])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }
}
