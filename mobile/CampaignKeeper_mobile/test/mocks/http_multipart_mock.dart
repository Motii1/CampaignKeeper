import 'package:http/http.dart';

class HttpMultipartMock implements MultipartRequest {
  int returnStatus = 200;

  @override
  int get contentLength => 0;

  @override
  set contentLength(int? value) {}

  @override
  bool get followRedirects => false;

  @override
  set followRedirects(bool value) {}

  @override
  int get maxRedirects => 0;

  @override
  set maxRedirects(int value) {}

  @override
  bool get persistentConnection => false;

  @override
  set persistentConnection(bool value) {}

  @override
  Map<String, String> get fields => {};

  @override
  List<MultipartFile> get files => [];

  @override
  ByteStream finalize() {
    throw UnimplementedError();
  }

  @override
  bool get finalized => throw UnimplementedError();

  @override
  Map<String, String> get headers => {};

  @override
  String get method => "PUT";

  @override
  Future<StreamedResponse> send() async {
    return StreamedResponse(_fakeResponseStream(), returnStatus);
  }

  @override
  Uri get url => Uri();

  Stream<List<int>> _fakeResponseStream() async* {
    yield [];
    return;
  }
}
