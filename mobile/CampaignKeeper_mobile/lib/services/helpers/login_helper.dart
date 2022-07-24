import 'dart:convert';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
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
  Future<Tuple<ResponseStatus, UserDataEntity?>> autoLogin() async {
    ResponseStatus? status;
    UserDataEntity? userEntity = DataCarrier().get();

    if (userEntity != null && userEntity.password != null) {
      var tuple = await login(userEntity.username, userEntity.password!);
      status = tuple.first;
      userEntity = tuple.second ?? (status == ResponseStatus.IncorrectData ? null : userEntity);
    }

    return Tuple(
      first: status ?? ResponseStatus.IncorrectData,
      second: userEntity,
    );
  }

  // Makes login request and returns status and (if available) user entity
  // derived from the response.
  Future<Tuple<ResponseStatus, UserDataEntity?>> login(String name, String password) async {
    Map body = {"username": name, "password": password};
    var response = await RequestHelper().post(endpoint: _loginEnd, body: body, isLogin: true);
    UserDataEntity? userEntity;

    if (response.status == ResponseStatus.Success) {
      Map responseData = json.decode(response.data!);
      responseData['password'] = password;

      userEntity = UserDataEntity.decode(responseData);
    }

    return Tuple(
      first: response.status,
      second: userEntity,
    );
  }

  Future<ResponseStatus> logout() async {
    await DataCarrier().clear();

    if (RequestHelper().isCookieValid()) {
      var response = await RequestHelper().post(endpoint: _logoutEnd, isLogin: false);

      RequestHelper().clearCookie();
      return response.status;
    }

    return ResponseStatus.Success;
  }
}
