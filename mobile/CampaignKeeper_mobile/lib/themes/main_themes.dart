import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class MainThemes {
  static const Color _primaryLight = Color(0xfffabe02);
  static const Color _onPrimaryLight = Color(0xff242424);

  static final Color _secondaryLight = Color(0xff09efc9);
  static const Color _onSecondaryLight = Color(0xff242424);

  static const Color _errorLight = Colors.redAccent;
  static const Color _onErrorLight = Color(0xff242424);

  static const Color _light = Color(0xffe7f1fd);
  static const Color _lighterLight = Color(0xfff5f9ff);
  static final MaterialColor _swatchLight =
      MaterialColor(_primaryLight.value, const <int, Color>{
    50: _primaryLight,
    100: _primaryLight,
    200: _primaryLight,
    300: _primaryLight,
    400: _primaryLight,
    500: _primaryLight,
    600: _primaryLight,
    700: _primaryLight,
    800: _primaryLight,
    900: _primaryLight,
  });

  static const Color _primaryDark = Color(0xffffe082);
  static const Color _onPrimaryDark = Color(0xff242424);

  static const Color _secondaryDark = Color(0xffa5c8e8);
  static const Color _onSecondaryDark = Color(0xff242424);

  static const Color _errorDark = Colors.redAccent;
  static const Color _onErrorDark = Color(0xff242424);

  static const Color _dark = Color(0xff262E38);
  static const Color _lighterDark = Color(0xff2a333e);
  static final MaterialColor _swatchDark =
      MaterialColor(_primaryDark.value, const <int, Color>{
    50: _primaryDark,
    100: _primaryDark,
    200: _primaryDark,
    300: _primaryDark,
    400: _primaryDark,
    500: _primaryDark,
    600: _primaryDark,
    700: _primaryDark,
    800: _primaryDark,
    900: _primaryDark,
  });

  static final ThemeData light = ThemeData(
    appBarTheme: AppBarTheme(
      elevation: 0.0,
      centerTitle: true,
      backgroundColor: _light,
      titleTextStyle: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.w500,
        color: _dark,
      ),
    ),
    backgroundColor: _lighterLight,
    colorScheme: ColorScheme(
      background: _light,
      brightness: Brightness.light,
      error: _errorLight,
      onBackground: _dark,
      onError: _onErrorLight,
      onPrimary: _onPrimaryLight,
      onSecondary: _onSecondaryLight,
      onSurface: _lighterDark,
      primary: _primaryLight,
      primaryVariant: _primaryDark,
      secondary: _secondaryLight,
      secondaryVariant: _secondaryDark,
      surface: _lighterLight,
    ),
    primaryColor: _primaryLight,
    primaryColorLight: _primaryLight,
    primaryColorDark: _primaryDark,
    primarySwatch: _swatchLight,
    scaffoldBackgroundColor: _light,
    toggleableActiveColor: _primaryLight,
  );

  static final ThemeData dark = ThemeData(
    appBarTheme: AppBarTheme(
      elevation: 0.0,
      centerTitle: true,
      backgroundColor: _dark,
      titleTextStyle: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.w500,
        color: _lighterLight,
      ),
    ),
    backgroundColor: _lighterDark,
    brightness: Brightness.dark,
    colorScheme: ColorScheme(
      background: _dark,
      brightness: Brightness.dark,
      error: _errorDark,
      onBackground: _light,
      onError: _onErrorDark,
      onPrimary: _onPrimaryDark,
      onSecondary: _onSecondaryDark,
      onSurface: _lighterLight,
      primary: _primaryDark,
      primaryVariant: _primaryLight,
      secondary: _secondaryDark,
      secondaryVariant: _secondaryLight,
      surface: _lighterDark,
    ),
    primaryColor: _primaryDark,
    primaryColorLight: _primaryDark,
    primaryColorDark: _primaryLight,
    primarySwatch: _swatchDark,
    scaffoldBackgroundColor: _dark,
    toggleableActiveColor: _primaryDark,
  );
}
