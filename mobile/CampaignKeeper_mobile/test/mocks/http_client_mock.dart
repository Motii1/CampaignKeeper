import 'dart:typed_data';

import 'dart:convert';

import 'package:http/http.dart';

class HttpClientMock implements Client {
  Response deleteResponse = Response("", 200);
  Response getResponse = Response("", 200);
  Response headResponse = Response("", 200);
  Response patchResponse = Response("", 200);
  Response postResponse = Response("", 200);
  Response putResponse = Response("", 200);

  @override
  void close() {}

  @override
  Future<Response> delete(Uri url, {Map<String, String>? headers, Object? body, Encoding? encoding}) async {
    return deleteResponse;
  }

  @override
  Future<Response> get(Uri url, {Map<String, String>? headers}) async {
    return getResponse;
  }

  @override
  Future<Response> head(Uri url, {Map<String, String>? headers}) async {
    return headResponse;
  }

  @override
  Future<Response> patch(Uri url, {Map<String, String>? headers, Object? body, Encoding? encoding}) async {
    return patchResponse;
  }

  @override
  Future<Response> post(Uri url, {Map<String, String>? headers, Object? body, Encoding? encoding}) async {
    return postResponse;
  }

  @override
  Future<Response> put(Uri url, {Map<String, String>? headers, Object? body, Encoding? encoding}) async {
    return putResponse;
  }

  @override
  Future<String> read(Uri url, {Map<String, String>? headers}) {
    throw UnimplementedError();
  }

  @override
  Future<Uint8List> readBytes(Uri url, {Map<String, String>? headers}) {
    throw UnimplementedError();
  }

  @override
  Future<StreamedResponse> send(BaseRequest request) {
    throw UnimplementedError();
  }
}
