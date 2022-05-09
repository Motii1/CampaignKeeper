import 'dart:typed_data';
import 'package:http_parser/http_parser.dart';

// Enumerator for a http request status.
enum ResponseStatus {
  Success,
  Error,
  IncorrectData,
  TimeOut,
}

// Wrapper for a http request response.
class Response {
  ResponseStatus status;
  String? data;
  dynamic dataBytes;

  Response(this.status, this.data, this.dataBytes);
}

// Enumerator for a file media type in a http
// request. Currently only image uploading
// is supported.
enum KeeperMediaType {
  image,
}

// Wrapper for a file representation.
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
