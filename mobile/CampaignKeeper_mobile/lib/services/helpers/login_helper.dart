import 'dart:convert';

import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/components/keeper_snack_bars.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/entities/user_login_ent.dart';
import 'package:flutter/material.dart';

class LoginHelper {
  static final LoginHelper _login = LoginHelper._internal();

  static const String _loginEnd = "/api/auth/login";
  static const String _logoutEnd = "/api/auth/logout";

  factory LoginHelper() {
    return _login;
  }

  LoginHelper._internal();

  Future<ResponseStatus> autoLogin() async {
    if (RequestHelper().isCookieValid()) {
      var status = await RequestHelper().testConnection();

      return status;
    }

    UserLoginEntity? loginEntity = DataCarrier().getEntity();
    if (loginEntity != null) {
      String name =
      loginEntity.name == "" ? loginEntity.email : loginEntity.name;
      String password = loginEntity.password;
      return await login(name, password);
    }

    return ResponseStatus.IncorrectData;
  }

  Future<ResponseStatus> login(String name, String password) async {
    Map body = {"username": name, "password": password};
    var response = await RequestHelper().post(endpoint: _loginEnd, body: body, isLogin: true);

    switch (response.status) {
      case ResponseStatus.Success:
        Response userResponse = await RequestHelper().get(UserLoginEntity.endpoint);

        if (userResponse.status == ResponseStatus.Success) {
          Map<String, dynamic> user = jsonDecode(userResponse.data!);

          UserLoginEntity loginEntity = new UserLoginEntity(
              name: user["username"], email: user["email"], password: password);

          DataCarrier().attach(loginEntity);

          return ResponseStatus.Success;
        }

        return ResponseStatus.Error;
      case ResponseStatus.IncorrectData:
        return ResponseStatus.IncorrectData;
      default:
        return ResponseStatus.Error;
    }
  }

  Future<ResponseStatus> logout({bool force = false}) async {
    if (force) {
      DataCarrier().deleteCache();
    }

    if (RequestHelper().isCookieValid()) {
      var response = await RequestHelper().post(endpoint: _logoutEnd);

      RequestHelper().clearCookie();
      return response.status;
    }

    return ResponseStatus.Success;
  }
}
