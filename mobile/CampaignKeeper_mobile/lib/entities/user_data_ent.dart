import 'dart:typed_data';
import 'package:flutter/material.dart';

class UserDataEntity {
  static const String endpoint = "/api/user/image";

  Uint8List? imageData;

  UserDataEntity({this.imageData});

  Image get image {
    if (imageData == null) {
      return Image.asset("assets/user.png");
    } else {
      return Image.memory(imageData!);
    }
  }
}
