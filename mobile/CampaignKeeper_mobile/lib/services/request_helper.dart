import 'dart:async';
import 'dart:io';
import 'package:campaign_keeper_mobile/entities/user_login_ent.dart';
import 'package:campaign_keeper_mobile/services/app_prefs.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:http/http.dart' as http;

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

class RequestHelper {
  static final RequestHelper _helper = RequestHelper._internal();
  static const String _pingEnd = "/api/ops/ping";
  static const String _loginEnd = "/api/auth/login";
  static const String _logoutEnd = "/api/auth/logout";
  Cookie? _cookie;

  factory RequestHelper() {
    return _helper;
  }

  RequestHelper._internal();

  Future<LoginStatus> autoLogin() async {
    await DataCarrier().refresh<UserLoginEntity>();

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
      response = await http.post(Uri.parse("${AppPrefs().url}$_loginEnd"), body: {
        "username": name,
        "password": password
      }).timeout(Duration(seconds: 2));
    } on TimeoutException catch (_) {
      return LoginStatus.ServerError;
    } on SocketException catch (_) {
      return LoginStatus.ServerError;
    }

    switch (response.statusCode) {
      case 200:
        _cookie = Cookie.fromSetCookieValue(response.headers["set-cookie"]);
        UserLoginEntity loginEntity = new UserLoginEntity(
            name: name.contains("@") ? "" : name,
            email: name.contains("@") ? name : "",
            password: password);
        DataCarrier().attach(loginEntity);
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
        response = await http.post(Uri.parse("${AppPrefs().url}$_logoutEnd"), headers: headers).timeout(Duration(seconds: 3));
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
      response = await http
          .get(Uri.parse("${AppPrefs().url}$_pingEnd"))
          .timeout(Duration(seconds: 2));
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

  // Returns string json or throws exception
  Future<String> get(String endpoint) async {
    throw new Exception("Error");
  }

  // Will be used in get
  bool _isCookieValid() {
    if (_cookie != null) {
      DateTime? expire = _cookie!.expires;
      if (expire != null) {
        return DateTime.now().isBefore(expire);
      }
    }

    return false;
  }

  String? getCookie() => _cookie.toString();
}

// TODO: make proper exceptions for http get
