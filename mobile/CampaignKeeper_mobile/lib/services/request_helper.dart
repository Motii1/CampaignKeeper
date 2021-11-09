import 'dart:async';

import 'package:campaign_keeper_mobile/entities/user_login_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:http/http.dart' as http;

class RequestHelper {
  static final RequestHelper _helper = RequestHelper._internal();
  static const String _url = "http://10.0.2.2:4000";
  static const String _pingEnd = "/ops/ping";
  static const String _loginEnd = "/auth/login";
  static const String _logoutEnd = "/auth/logout";

  factory RequestHelper() {
    return _helper;
  }

  // Adding managers
  RequestHelper._internal() {
    print("Request constructor");
    DataCarrier().refresh<UserLoginEntity>();
  }

  // login returns: 0 - success, -1 - incorrect data, -2 - server error
  Future<int> autoLogin() async {
    UserLoginEntity? loginEntity = DataCarrier().getEntity();
    if (loginEntity != null) {
      String name = loginEntity.name;
      String password = loginEntity.password;
      return await login(name: name, password: password);
    }

    return -1;
  }

  Future<int> login({required String name, required String password}) async {
    return -1;
  }

  Future<int> logout() async {
    return -1;
  }

  Future<int> testConnection() async {
    try {
      http.Response response = await http.get(Uri.parse("$_url$_pingEnd")).timeout(Duration(seconds: 2));
      switch (response.statusCode) {
        case 200:
          return 0;
        default:
          return -1;
      }
    } on TimeoutException catch (_) {
      return -2;
    }
}

  // Returns string json or throws exception
  Future<String> get({required String endpoint}) async {
    throw new Exception("Error");
  }
}

// TODO: make proper exceptions for http get