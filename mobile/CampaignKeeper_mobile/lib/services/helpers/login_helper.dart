import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';

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

    UserDataEntity? userEntity = DataCarrier().getEntity();
    if (userEntity != null && userEntity.password != null) {
      ResponseStatus status = await login(userEntity.username, userEntity.password!);

      return status;
    }

    return ResponseStatus.IncorrectData;
  }

  Future<ResponseStatus> login(String name, String password) async {
    Map body = {"username": name, "password": password};
    var response = await RequestHelper()
        .post(endpoint: _loginEnd, body: body, isLogin: true);

    if (response.status == ResponseStatus.Success) {
      UserDataEntity? ent = DataCarrier().getEntity<UserDataEntity>();

      if (ent == null) {
        ent = UserDataEntity(username: name, email: name, password: password);
        DataCarrier().attach(ent);
        await DataCarrier().refresh<UserDataEntity>();
      }
    }

    return response.status;
  }

  Future<ResponseStatus> logout({bool force = false}) async {
    if (force) {
      DataCarrier().clear();
    }

    if (RequestHelper().isCookieValid()) {
      var response = await RequestHelper().post(endpoint: _logoutEnd);

      RequestHelper().clearCookie();
      return response.status;
    }

    return ResponseStatus.Success;
  }
}
