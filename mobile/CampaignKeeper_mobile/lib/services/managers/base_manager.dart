abstract class BaseManager<T> {
  // Data locations: cache, ram, server

  // Attaches given entity to the local base and cache it
  // If ever this app would save new data then it should also update server database
  void attach(T entity);

  T? getEntity({int groupId= -1, int entId= -1});

  List<T> getEntities({int groupId= -1});

  // TODO: enum instead of int
  // Should be debated about caching all vs specified data
  // Get all data from cache, then try to download new, specified one
  // If successful cache all data and return 1
  // Else return 0
  Future<int> refresh({int groupId = -1});
}