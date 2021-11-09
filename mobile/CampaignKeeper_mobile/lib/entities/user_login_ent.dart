// TODO: make UserDataEntity with campaign info, avatar, etc.
class UserLoginEntity {
  String name;
  String email;
  String password;
  int id;

  UserLoginEntity({required this.id, required this.name, required this.email, required this.password});
}