class SessionEntity {
  static const String endpoint = "/api/session/list";

  int id;
  int campaignId;
  String name;
  DateTime createdAt;

  SessionEntity({required this.id, required this.campaignId, required this.name, required this.createdAt});
}
