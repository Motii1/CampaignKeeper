import 'dart:convert';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/types/http_types.dart';

// Helper that handles login and logout functionality.
class LoginHelper {
  static final LoginHelper _login = LoginHelper._internal();

  static const String _loginEnd = "/api/auth/login";
  static const String _logoutEnd = "/api/auth/logout";

  factory LoginHelper() {
    return _login;
  }

  LoginHelper._internal();

  // Uses cached information from DataCarrier to login.
  Future<ResponseStatus> autoLogin() async {
    ResponseStatus? status;

    if (RequestHelper().isCookieValid()) {
      status = await RequestHelper().testConnection();
    }

    UserDataEntity? userEntity = DataCarrier().get();
    if (userEntity != null && userEntity.password != null) {
      status = await login(userEntity.username, userEntity.password!);
    }

    return status ?? ResponseStatus.IncorrectData;
  }

  Future<ResponseStatus> login(String name, String password) async {
    Map body = {"username": name, "password": password};
    var response = await RequestHelper().post(endpoint: _loginEnd, body: body, isLogin: true);

    if (response.status == ResponseStatus.Success) {
      Map responseData = json.decode(response.data!);

      UserDataEntity entity = new UserDataEntity(
          username: responseData["username"],
          email: responseData["email"],
          password: password,
          imageData: responseData["image"]);

      DataCarrier().attach(entity);
    }

    return response.status;
  }

  Future<ResponseStatus> logout() async {
    DataCarrier().clear();

    if (RequestHelper().isCookieValid()) {
      var response = await RequestHelper().post(endpoint: _logoutEnd, isLogin: false);

      RequestHelper().clearCookie();
      return response.status;
    }

    return ResponseStatus.Success;
  }
}
