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
