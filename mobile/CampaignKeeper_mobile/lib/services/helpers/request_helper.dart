import 'dart:async';
import 'dart:io';
import 'package:campaign_keeper_mobile/types/http_types.dart';
import 'package:flutter/material.dart';
import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/services/helpers/dependencies_helper.dart';
import 'package:campaign_keeper_mobile/services/helpers/login_helper.dart';
import 'package:http/http.dart' as http;

// Helper used to simplify http requests.
// Also allows to retrieve last connection status.
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
  Future<Response> get({
    required String endpoint,
    List<RequestParameter>? params,
    bool isAutoLogin = true,
    bool isSilent = false,
  }) async {
    var buffer = StringBuffer();

    buffer.write(endpoint);

    if (params != null) {
      params.forEach((element) {
        buffer.write(element.parameter);
      });
    }

    String address = buffer.toString();

    Map<String, String> headers = {"Cookie": isCookieValid() ? _cookie.toString() : ""};
    var response;
    try {
      response = await DependenciesHelper()
          .client
          .get(Uri.parse("${AppPrefs().url}$address"), headers: headers)
          .timeout(Duration(seconds: AppPrefs().timeout));
    } on TimeoutException catch (_) {
      if (!isSilent) {
        _changeStatus(false);
      }

      return Response(ResponseStatus.TimeOut, null, null);
    } on SocketException catch (_) {
      if (!isSilent) {
        _changeStatus(false);
      }

      return Response(ResponseStatus.Error, null, null);
    } on Exception catch (_) {
      if (!isSilent) {
        _changeStatus(false);
      }

      return Response(ResponseStatus.Error, null, null);
    } catch (e) {
      print(e);
      if (!isSilent) {
        _changeStatus(false);
      }

      return Response(ResponseStatus.Error, null, null);
    }

    print("Get status: ${response.statusCode}");

    if (!isSilent) {
      _changeStatus(true);
    }

    if (response.statusCode == 200) {
      return Response(ResponseStatus.Success, response.body, response.bodyBytes);
    } else if (response.statusCode >= 400 && response.statusCode < 500) {
      if (isAutoLogin && !isCookieValid()) {
        ResponseStatus loginResponse = await LoginHelper().autoLogin();
        if (loginResponse == ResponseStatus.Success) {
          return await get(endpoint: endpoint, params: params, isAutoLogin: false);
        }
      }

      return Response(ResponseStatus.IncorrectData, null, null);
    } else {
      return Response(ResponseStatus.Error, null, null);
    }
  }

  // Posts given body and returns a response.
  Future<Response> post({
    required String endpoint,
    Object? body,
    bool isLogin = false,
    bool isAutoLogin = true,
    bool isSilent = false,
  }) async {
    Map<String, String> headers = {"cookie": isCookieValid() ? _cookie.toString() : ""};
    var response;
    try {
      response = await DependenciesHelper()
          .client
          .post(Uri.parse("${AppPrefs().url}$endpoint"), body: body, headers: isLogin ? null : headers)
          .timeout(Duration(seconds: isLogin ? AppPrefs().loginTimeout : AppPrefs().timeout));
    } on TimeoutException catch (_) {
      if (!isSilent) {
        _changeStatus(true);
      }

      return Response(ResponseStatus.TimeOut, null, null);
    } on SocketException catch (_) {
      if (!isSilent) {
        _changeStatus(true);
      }

      return Response(ResponseStatus.Error, null, null);
    } on Exception catch (_) {
      if (!isSilent) {
        _changeStatus(true);
      }

      return Response(ResponseStatus.Error, null, null);
    } catch (_) {
      if (!isSilent) {
        _changeStatus(true);
      }

      return Response(ResponseStatus.Error, null, null);
    }

    print("Post status: ${response.statusCode}");

    if (!isSilent) {
      _changeStatus(true);
    }

    if (response.statusCode == 200) {
      if (response.headers["set-cookie"] != null) {
        _cookie = Cookie.fromSetCookieValue(response.headers["set-cookie"]);
      }

      return Response(ResponseStatus.Success, response.body, response.bodyBytes);
    } else if (response.statusCode >= 400 && response.statusCode < 500) {
      if (isAutoLogin && !isLogin && !isCookieValid()) {
        ResponseStatus loginResponse = await LoginHelper().autoLogin();
        if (loginResponse == ResponseStatus.Success) {
          return await post(
              endpoint: endpoint, body: body, isLogin: isLogin, isAutoLogin: false, isSilent: isSilent);
        }
      }

      return Response(ResponseStatus.IncorrectData, null, null);
    } else {
      return Response(ResponseStatus.Error, null, null);
    }
  }

  // Puts file and returns a respond.
  Future<Response> putFile(
      {required String endpoint,
      Map<String, String>? fields,
      KeeperFile? file,
      bool isAutoLogin = true}) async {
    var request = DependenciesHelper().multipartRequest("PUT", Uri.parse("${AppPrefs().url}$endpoint"));
    Map<String, String> headers = {
      "cookie": isCookieValid() ? _cookie.toString() : "",
    };
    request.headers.addAll(headers);

    if (file != null) {
      request.files.add(
          http.MultipartFile.fromBytes(file.name, file.bytes, filename: file.name, contentType: file.type));
    }

    if (fields != null) {
      request.fields.addAll(fields);
    }

    http.StreamedResponse streamResponse;

    try {
      streamResponse = await request.send().timeout(Duration(seconds: AppPrefs().timeout));
    } on TimeoutException catch (_) {
      return Response(ResponseStatus.TimeOut, null, null);
    } catch (_) {
      return Response(ResponseStatus.Error, null, null);
    }

    http.Response response = await http.Response.fromStream(streamResponse);

    print("Put status: ${response.statusCode}");

    if (response.statusCode == 200) {
      return Response(ResponseStatus.Success, response.body, response.bodyBytes);
    } else if (response.statusCode >= 400 && response.statusCode < 500) {
      if (isAutoLogin && !isCookieValid()) {
        ResponseStatus loginResponse = await LoginHelper().autoLogin();
        if (loginResponse == ResponseStatus.Success) {
          return await putFile(endpoint: endpoint, fields: fields, file: file, isAutoLogin: false);
        }
      }

      return Response(ResponseStatus.IncorrectData, response.body, response.bodyBytes);
    } else {
      return Response(ResponseStatus.Error, null, null);
    }
  }

  // Returns a value if cookie is still valid.
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
