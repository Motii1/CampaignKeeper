import 'dart:async';
import 'dart:io';
import 'package:campaign_keeper_mobile/types/types.dart';
import 'package:flutter/material.dart';
import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/services/helpers/dependencies_helper.dart';
import 'package:campaign_keeper_mobile/services/helpers/login_helper.dart';
import 'package:http/http.dart' as http;

class RequestHelper extends ChangeNotifier {
  static final RequestHelper _helper = RequestHelper._internal();

  static const String _pingEnd = "/api/ops/ping";
  Cookie? _cookie;
  bool _isOnline = true;

  bool get isOnline => _isOnline;

  factory RequestHelper() {
    return _helper;
  }

  RequestHelper._internal();

  Future<ResponseStatus> testConnection() async {
    var response = await get(endpoint: _pingEnd, isSilent: true);

    return response.status;
  }

  // Returns pair of a respond status and a string json
  Future<Response> get({required String endpoint, bool isAutoLogin = true, bool isSilent = false}) async {
    Map<String, String> headers = {"Cookie": isCookieValid() ? _cookie.toString() : ""};
    var response;
    try {
      response = await DependenciesHelper()
          .client
          .get(Uri.parse("${AppPrefs().url}$endpoint"), headers: headers)
          .timeout(Duration(seconds: AppPrefs().timeout));
    } on TimeoutException catch (_) {
      if (!isSilent) {
        _changeStatus(false);
      }

      return Response(ResponseStatus.TimeOut, null, null);
    } on Exception catch (_) {
      if (!isSilent) {
        _changeStatus(false);
      }

      return Response(ResponseStatus.Error, null, null);
    }

    print("Get status: ${response.statusCode}");

    if (!isSilent) {
      _changeStatus(true);
    }

    switch (response.statusCode) {
      case 200:
        return Response(ResponseStatus.Success, response.body, response.bodyBytes);
      case 400:
      case 401:
      case 402:
      case 403:
      case 404:
        if (isAutoLogin && !isCookieValid()) {
          ResponseStatus loginResponse = await LoginHelper().autoLogin();
          if (loginResponse == ResponseStatus.Success) {
            return await get(endpoint: endpoint, isAutoLogin: false);
          }
        }

        return Response(ResponseStatus.IncorrectData, null, null);
      default:
        return Response(ResponseStatus.Error, null, null);
    }
  }

  Future<Response> post(
      {required String endpoint, Object? body, bool isLogin = false, bool isAutoLogin = true}) async {
    Map<String, String> headers = {"cookie": isCookieValid() ? _cookie.toString() : ""};
    var response;
    try {
      response = await DependenciesHelper()
          .client
          .post(Uri.parse("${AppPrefs().url}$endpoint"), body: body, headers: isLogin ? null : headers)
          .timeout(Duration(seconds: isLogin ? AppPrefs().loginTimeout : AppPrefs().timeout));
    } on TimeoutException catch (_) {
      _changeStatus(false);
      return Response(ResponseStatus.TimeOut, null, null);
    } on Exception catch (_) {
      _changeStatus(false);
      return Response(ResponseStatus.Error, null, null);
    }

    print("Post status: ${response.statusCode}");

    _changeStatus(true);
    switch (response.statusCode) {
      case 200:
        _cookie = Cookie.fromSetCookieValue(response.headers["set-cookie"]);

        return Response(ResponseStatus.Success, response.body, response.bodyBytes);
      case 400:
      case 401:
      case 402:
      case 403:
      case 404:
        if (isAutoLogin && !isLogin && !isCookieValid()) {
          ResponseStatus loginResponse = await LoginHelper().autoLogin();
          if (loginResponse == ResponseStatus.Success) {
            return await post(endpoint: endpoint, body: body, isLogin: isLogin, isAutoLogin: false);
          }
        }

        return Response(ResponseStatus.IncorrectData, null, null);
      default:
        return Response(ResponseStatus.Error, null, null);
    }
  }

  Future<Response> putFile({required String endpoint, required KeeperFile file}) async {
    Map<String, String> headers = {
      "cookie": isCookieValid() ? _cookie.toString() : "",
      "Content-type": "multipart/form-data",
    };
    var request = new http.MultipartRequest("PUT", Uri.parse("${AppPrefs().url}$endpoint"));
    http.StreamedResponse streamResponse;
    http.Response response;

    request.files.add(
        http.MultipartFile.fromBytes(file.name, file.bytes, filename: file.name, contentType: file.type));
    request.headers.addAll(headers);

    try {
      streamResponse = await request.send().timeout(Duration(seconds: AppPrefs().timeout));
    } on TimeoutException catch (_) {
      return Response(ResponseStatus.TimeOut, null, null);
    } on Exception catch (_) {
      return Response(ResponseStatus.Error, null, null);
    }

    response = await http.Response.fromStream(streamResponse);

    print("Put status: ${response.statusCode}");

    switch (response.statusCode) {
      case 200:
        return Response(ResponseStatus.Success, await response.body, await response.bodyBytes);
      case 400:
      case 401:
      case 402:
      case 403:
      case 404:
        print("Error response: " + await response.body.toString());
        return Response(ResponseStatus.IncorrectData, null, null);
      default:
        return Response(ResponseStatus.Error, null, null);
    }
  }

  bool isCookieValid() {
    if (_cookie != null) {
      DateTime? expire = _cookie!.expires;

      if (expire != null && DateTime.now().isBefore(expire)) {
        return true;
      }
    }

    _cookie = null;
    return false;
  }

  void clearCookie() {
    _cookie = null;
  }

  void _changeStatus(bool status) {
    if (status != _isOnline) {
      _isOnline = status;
      notifyListeners();
    }
  }
}
