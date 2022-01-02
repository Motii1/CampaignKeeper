import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:campaign_keeper_mobile/entities/user_login_ent.dart';
import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/dependencies_helper.dart';

enum ServerStatus {
  Available,
  Error,
  TimeOut,
}

enum LoginStatus {
  Success,
  IncorrectData,
  ServerError,
}

enum LogoutStatus {
  Success,
  ServerError,
}

enum ResponseStatus {
  Success,
  Error,
  TimeOut,
}

class RequestHelper {
  static final RequestHelper _helper = RequestHelper._internal();

  static const String _pingEnd = "/api/ops/ping";
  static const String _loginEnd = "/api/auth/login";
  static const String _logoutEnd = "/api/auth/logout";
  static const int _timeout = 5;
  Cookie? _cookie;

  factory RequestHelper() {
    return _helper;
  }

  RequestHelper._internal();

  Future<LoginStatus> autoLogin() async {
    if (_isCookieValid()) {
      var status = await testConnection();

      switch (status) {
        case ServerStatus.Available:
          return LoginStatus.Success;
        default:
          return LoginStatus.ServerError;
      }
    }

    UserLoginEntity? loginEntity = DataCarrier().getEntity();
    if (loginEntity != null) {
      String name =
          loginEntity.name == "" ? loginEntity.email : loginEntity.name;
      String password = loginEntity.password;
      return await login(name, password);
    }

    return LoginStatus.IncorrectData;
  }

  Future<LoginStatus> login(String name, String password) async {
    var response;
    try {
      response = await DependenciesHelper()
          .client
          .post(Uri.parse("${AppPrefs().url}$_loginEnd"), body: {
        "username": name,
        "password": password
      }).timeout(Duration(seconds: _timeout));
    } on TimeoutException catch (_) {
      return LoginStatus.ServerError;
    } on SocketException catch (_) {
      return LoginStatus.ServerError;
    }

    switch (response.statusCode) {
      case 200:
        _cookie = Cookie.fromSetCookieValue(response.headers["set-cookie"]);
        Response userResponse = await get(UserLoginEntity.endpoint);

        switch(userResponse.status) {
          case ResponseStatus.Success:
            Map<String, dynamic> user = jsonDecode(userResponse.data!);

            UserLoginEntity loginEntity = new UserLoginEntity(
                name: user["username"],
                email: user["email"],
                password: password);

            DataCarrier().attach(loginEntity);
            break;
        }

        return LoginStatus.Success;
      case 400:
        return LoginStatus.IncorrectData;
      case 401:
        return LoginStatus.IncorrectData;
      default:
        return LoginStatus.ServerError;
    }
  }

  Future<LogoutStatus> logout({bool force = false}) async {
    if (force) {
      DataCarrier().deleteCache();
    }

    if (_cookie != null) {
      Map<String, String> headers = {"cookie": _cookie.toString()};
      var response;

      try {
        response = await DependenciesHelper()
            .client
            .post(Uri.parse("${AppPrefs().url}$_logoutEnd"), headers: headers)
            .timeout(Duration(seconds: _timeout));
      } on TimeoutException catch (_) {
        return LogoutStatus.ServerError;
      } on SocketException catch (_) {
        return LogoutStatus.ServerError;
      }

      switch (response.statusCode) {
        case 200:
          _cookie = null;
          return LogoutStatus.Success;
        default:
          return LogoutStatus.ServerError;
      }
    }

    return LogoutStatus.Success;
  }

  Future<ServerStatus> testConnection() async {
    var response;
    try {
      response = await DependenciesHelper()
          .client
          .get(Uri.parse("${AppPrefs().url}$_pingEnd"))
          .timeout(Duration(seconds: _timeout));
    } on TimeoutException catch (_) {
      return ServerStatus.TimeOut;
    } on SocketException catch (_) {
      return ServerStatus.Error;
    }

    switch (response.statusCode) {
      case 200:
        return ServerStatus.Available;
      default:
        return ServerStatus.Error;
    }
  }

  // Returns pair of a respond status and a string json
  Future<Response> get(String endpoint) async {
    if (!_isCookieValid()) {
      LoginStatus status = await autoLogin();

      switch(status) {
        case LoginStatus.Success:
          break;
        default:
          return new Response(ResponseStatus.Error, null, null);
      }
    }

    Map<String, String> headers = {"cookie": _cookie.toString()};
    var response;

    try {
      response = await DependenciesHelper()
          .client
          .get(Uri.parse("${AppPrefs().url}$endpoint"), headers: headers)
          .timeout(Duration(seconds: _timeout));
    } on TimeoutException catch (_) {
      return new Response(ResponseStatus.TimeOut, null, null);
    } on Exception catch (_) {
      return new Response(ResponseStatus.Error, null, null);
    }

    switch (response.statusCode) {
      case 200:
        return new Response(ResponseStatus.Success, response.body, response.bodyBytes);
      default:
        return new Response(ResponseStatus.Error, null, null);
    }
  }

  bool _isCookieValid() {
    if (_cookie != null) {
      DateTime? expire = _cookie!.expires;

      if (expire != null && DateTime.now().isBefore(expire)) {
        return true;
      }
    }

    _cookie = null;
    return false;
  }

  String? getCookie() => _cookie.toString();
}

class Response {
  ResponseStatus status;
  String? data;
  dynamic dataBytes;

  Response(this.status, this.data, this.dataBytes);
}
