import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';

// Entity representing an user data.
class UserDataEntity {
  static const String endpoint = "/api/user/details";
  static const String imageEndpoint = "/api/user/image";

  Image _imageCache = Image.asset("assets/user.png");
  String? _imageData;

  String username;
  String email;
  String? password;

  UserDataEntity({required this.username, required this.email, this.password, String? imageData}) {
    this.imageData = imageData;
  }

  // Named constructor that uses bytes list as an image source.
  UserDataEntity.imageBytes(
      {required this.username, required this.email, this.password, required Uint8List imageData}) {
    String base = base64.encode(imageData);
    this.imageData = base;
  }

  String? get imageData => _imageData;

  // A setter that also updates an cached image.
  void set imageData(String? value) {
    _imageData = value;

    if (value != null) {
      _imageCache = Image.memory(
        base64.decode(value),
        gaplessPlayback: true,
      );
    }
  }

  Image get image => _imageCache;

  bool equals(UserDataEntity other) {
    return username == other.username &&
        email == other.email &&
        imageData == other.imageData &&
        password == other.password;
  }
}
