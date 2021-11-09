abstract class BaseManager<T> {
  // Data locations: cache, ram, server

  // Attaches given entity to the local base and cache it
  // If ever this app would save real data should also update server database
  void attach(T entity);

  T? getEntity({int groupId= -1, int entId= -1});

  List<T> getEntities({int groupId= -1});

  // If specific data not loaded from cache load it, then check version with web
  // And if new data available download it.
  Future<void> refresh({int groupId = -1});

  // Wipe current cache and save all data kept in ram to the device
  // Should be used when app is paused and goes to the background (WidgetsBindingObserver class)
  // Or when user exits the app by pressing back button twice on main screen
  // We don't have to worry about force close of the app as it's unlikely to happen without prior pausing
  Future<void> cacheAll();
}