class UserLoginEntity {
  static const String loginEndpoint = "/api/user/details";

  String name;
  String email;
  String password;

  UserLoginEntity({required this.name, required this.email, required this.password});
}