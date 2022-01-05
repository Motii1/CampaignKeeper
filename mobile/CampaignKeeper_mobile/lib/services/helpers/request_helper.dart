import 'dart:async';
import 'dart:io';
import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/services/helpers/dependencies_helper.dart';
import 'package:campaign_keeper_mobile/services/helpers/login_helper.dart';

enum ResponseStatus {
  Success,
  Error,
  IncorrectData,
  TimeOut,
}

class RequestHelper {
  static final RequestHelper _helper = RequestHelper._internal();

  static const String _pingEnd = "/api/ops/ping";
  Cookie? _cookie;

  factory RequestHelper() {
    return _helper;
  }

  RequestHelper._internal();

  Future<ResponseStatus> testConnection() async {
    var response = await get(endpoint: _pingEnd);

    return response.status;
  }

  // Returns pair of a respond status and a string json
  Future<Response> get(
      {required String endpoint, bool onlyOnce = false}) async {
    Map<String, String> headers = {
      "cookie": isCookieValid() ? _cookie.toString() : ""
    };
    var response;

    try {
      response = await DependenciesHelper()
          .client
          .get(Uri.parse("${AppPrefs().url}$endpoint"), headers: headers)
          .timeout(Duration(seconds: AppPrefs().timeout));
    } on TimeoutException catch (_) {
      return Response(ResponseStatus.TimeOut, null, null);
    } on Exception catch (_) {
      return Response(ResponseStatus.Error, null, null);
    }

    switch (response.statusCode) {
      case 200:
        return Response(
            ResponseStatus.Success, response.body, response.bodyBytes);
      case 400:
      case 401:
      case 402:
      case 403:
        if (!onlyOnce && !isCookieValid()) {
          ResponseStatus loginResponse = await LoginHelper().autoLogin();
          if (loginResponse == ResponseStatus.Success) {
            return await get(endpoint: endpoint, onlyOnce: true);
          }
        }

        return Response(ResponseStatus.IncorrectData, null, null);
      default:
        return Response(ResponseStatus.Error, null, null);
    }
  }

  Future<Response> post(
      {required String endpoint,
      Object? body,
      bool isLogin = false,
      bool onlyOnce = false}) async {
    //TODO: maybe headers with cookies here and in get are not needed, it's seems they are automatic
    Map<String, String> headers = {
      "cookie": isCookieValid() ? _cookie.toString() : ""
    };
    var response;
    try {
      response = await DependenciesHelper()
          .client
          .post(Uri.parse("${AppPrefs().url}$endpoint"),
              body: body, headers: headers)
          .timeout(Duration(
              seconds: isLogin ? AppPrefs().loginTimeout : AppPrefs().timeout));
    } on TimeoutException catch (_) {
      return Response(ResponseStatus.TimeOut, null, null);
    } on Exception catch (_) {
      return Response(ResponseStatus.Error, null, null);
    }

    switch (response.statusCode) {
      case 200:
        if (!isCookieValid()) {
          _cookie = Cookie.fromSetCookieValue(response.headers["set-cookie"]);
        }

        return Response(
            ResponseStatus.Success, response.body, response.bodyBytes);
      case 400:
      case 401:
        if (!onlyOnce && !isCookieValid()) {
          ResponseStatus loginResponse = await LoginHelper().autoLogin();
          if (loginResponse == ResponseStatus.Success) {
            return await post(
                endpoint: endpoint,
                body: body,
                isLogin: isLogin,
                onlyOnce: true);
          }
        }

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
}

class Response {
  ResponseStatus status;
  String? data;
  dynamic dataBytes;

  Response(this.status, this.data, this.dataBytes);
}
