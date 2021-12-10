import 'dart:typed_data';
import 'package:flutter/material.dart';

class UserDataEntity {
  static const String imageEndpoint = "/api/user/image";

  Uint8List? imageData;

  UserDataEntity(this.imageData);

  Image get avatar {
    if (imageData == null) {
      return new Image.asset("user.png");
    }
    else {
      return new Image.memory(imageData!);
    }
  }
}