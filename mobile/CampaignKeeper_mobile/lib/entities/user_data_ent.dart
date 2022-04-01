import 'dart:convert';
import 'package:flutter/material.dart';

class UserDataEntity {
  static const String endpoint = "/api/user/details";

  String username;
  String email;
  String? password;
  String? imageData;

  UserDataEntity({required this.username, required this.email, this.password, this.imageData});

  Image get image {
    if (imageData == null) {
      return Image.asset("assets/user.png");
    } else {
      return Image.memory(
        base64.decode(imageData!),
        gaplessPlayback: true,
      );
    }
  }
}
