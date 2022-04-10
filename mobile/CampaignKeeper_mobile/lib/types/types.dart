import 'dart:typed_data';
import 'package:http_parser/http_parser.dart';

enum ResponseStatus {
  Success,
  Error,
  IncorrectData,
  TimeOut,
}

class Response {
  ResponseStatus status;
  String? data;
  dynamic dataBytes;

  Response(this.status, this.data, this.dataBytes);
}

enum KeeperMediaType {
  image,
}

class KeeperFile {
  String name;
  Uint8List bytes;
  KeeperMediaType _type;

  KeeperFile({required this.name, required KeeperMediaType type, required this.bytes}) : _type = type;

  MediaType get type {
    switch (_type) {
      case KeeperMediaType.image:
        return MediaType('image', 'jpeg');
      default:
        return MediaType('application', 'json');
    }
  }
}
