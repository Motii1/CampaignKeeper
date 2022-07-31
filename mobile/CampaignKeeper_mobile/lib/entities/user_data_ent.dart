import 'dart:convert';
import 'dart:typed_data';
import 'package:campaign_keeper_mobile/entities/base_entity.dart';
import 'package:flutter/material.dart';

// Entity representing an user data.
class UserDataEntity implements BaseEntity {
  UserDataEntity({required this.username, required this.email, this.password, String? imageData}) {
    this.imageData = imageData;
  }

  // Named constructor that uses bytes list as an image source.
  UserDataEntity.imageBytes(
      {required this.username, required this.email, this.password, required Uint8List imageData}) {
    String base = base64.encode(imageData);
    this.imageData = base;
  }

  UserDataEntity.fromMap(Map data) {
    username = data["username"];
    email = data["email"];
    password = data["password"];
    imageData = data["image"];
  }

  static const String endpoint = "/api/user/details";
  static const String imageEndpoint = "/api/user/image";

  late String username;
  late String email;
  String? password;

  Image _imageCache = Image.asset("assets/user.png");
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
      "username": username,
      "email": email,
      "password": password,
      "image": imageData,
    };

    return data;
  }

  bool equals(Object? other) {
    if (other == null || !(other is UserDataEntity)) {
      return false;
    }

    return username == other.username &&
        email == other.email &&
        imageData == other.imageData &&
        password == other.password;
  }
}
