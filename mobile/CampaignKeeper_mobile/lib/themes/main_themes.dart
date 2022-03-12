import 'package:flutter/material.dart';

class MainThemes {
  static const double _textColorOpacitySecondary = 0.7;
  static const double _textColorOpacityPrimary = 0.9;
  static const double _radius = 10.0;

  static const Color _primaryLight = Color(0xfff8bc02);
  static const Color _onPrimaryLight = Color(0xff242424);

  static final Color _secondaryLight = Color(0xff09efc9);
  static const Color _onSecondaryLight = Color(0xff242424);

  static const Color _errorLight = Colors.redAccent;
  static const Color _onErrorLight = Color(0xff242424);

  static const Color _light = Color(0xffd0e6fc);
  static const Color _lighterLight = Color(0xffecf8ff);

  static final MaterialColor _swatchLight = MaterialColor(_primaryLight.value, const <int, Color>{
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

  static final TextStyle _textColorLight = TextStyle(
    color: _lighterDark.withOpacity(_textColorOpacitySecondary),
  );
  static final TextStyle _textColorTitleLight = TextStyle(
    color: _lighterDark.withOpacity(_textColorOpacityPrimary),
  );

  static const Color _primaryDark = Color(0xffffe082);
  static const Color _onPrimaryDark = Color(0xff242424);

  static const Color _secondaryDark = Color(0xffa5c8e8);
  static const Color _onSecondaryDark = Color(0xff242424);

  static const Color _errorDark = Colors.redAccent;
  static const Color _onErrorDark = Color(0xff242424);

  static const Color _dark = Color(0xff262E38);
  static const Color _lighterDark = Color(0xff303d50);
  static final MaterialColor _swatchDark = MaterialColor(_primaryDark.value, const <int, Color>{
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

  static final TextStyle _textColorDark = TextStyle(
    color: _light.withOpacity(_textColorOpacitySecondary),
  );
  static final TextStyle _textColorTitleDark = TextStyle(
    color: _light.withOpacity(_textColorOpacityPrimary),
  );

  static final ThemeData light = ThemeData(
    appBarTheme: AppBarTheme(
      elevation: 0.0,
      centerTitle: true,
      backgroundColor: _lighterLight,
      titleTextStyle: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.w500,
        color: _lighterDark.withOpacity(_textColorOpacityPrimary),
      ),
      iconTheme: IconThemeData(
        color: _lighterDark.withOpacity(_textColorOpacitySecondary),
      ),
    ),
    backgroundColor: _lighterLight,
    colorScheme: ColorScheme(
      background: _lighterLight,
      brightness: Brightness.light,
      error: _errorLight,
      onBackground: _lighterDark,
      onError: _onErrorLight,
      onPrimary: _onPrimaryLight,
      onSecondary: _onSecondaryLight,
      onSurface: _dark,
      primary: _primaryLight,
      secondary: _secondaryLight,
      surface: _light,
    ),
    primaryColor: _primaryLight,
    primaryColorLight: _primaryLight,
    primaryColorDark: _primaryDark,
    primarySwatch: _swatchLight,
    scaffoldBackgroundColor: _lighterLight,
    toggleableActiveColor: _primaryLight,
    cardColor: _light,
    inputDecorationTheme: InputDecorationTheme(
      contentPadding: EdgeInsets.symmetric(vertical: 4, horizontal: 10),
      filled: true,
      fillColor: _lighterLight,
      labelStyle: TextStyle(
        color: _lighterDark.withOpacity(0.7),
      ),
      errorStyle: TextStyle(
        color: _errorLight,
      ),
      border: UnderlineInputBorder(
          borderRadius:
              BorderRadius.only(topLeft: Radius.circular(_radius), topRight: Radius.circular(_radius)),
          borderSide: BorderSide(
            color: _lighterDark,
            width: 1.8,
          )),
      enabledBorder: UnderlineInputBorder(
          borderRadius:
              BorderRadius.only(topLeft: Radius.circular(_radius), topRight: Radius.circular(_radius)),
          borderSide: BorderSide(
            color: _lighterDark,
            width: 1.8,
          )),
      errorBorder: UnderlineInputBorder(
        borderRadius:
            BorderRadius.only(topLeft: Radius.circular(_radius), topRight: Radius.circular(_radius)),
        borderSide: BorderSide(
          color: _errorLight,
          width: 1.8,
        ),
      ),
    ),
    textTheme: TextTheme(
      headline1: _textColorTitleLight,
      headline2: _textColorTitleLight,
      headline3: _textColorTitleLight,
      headline4: _textColorTitleLight,
      headline5: _textColorTitleLight,
      headline6: _textColorTitleLight,
      subtitle1: _textColorTitleLight,
      subtitle2: _textColorLight,
      bodyText1: _textColorLight,
      bodyText2: _textColorLight,
      caption: _textColorLight,
    ),
    cardTheme: CardTheme(
        shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(_radius)),
    )),
    snackBarTheme: SnackBarThemeData(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(_radius)),
      ),
      behavior: SnackBarBehavior.floating,
      backgroundColor: _dark,
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: _light,
      indicatorColor: _primaryLight,
      iconTheme: MaterialStateProperty.all(IconThemeData(
        color: _dark,
        size: 25,
      )),
      labelTextStyle: MaterialStateProperty.all(TextStyle(
        color: _dark,
        fontSize: 15,
        fontWeight: FontWeight.w600,
      )),
    ),
  );

  static final ThemeData dark = ThemeData(
    appBarTheme: AppBarTheme(
      elevation: 0.0,
      centerTitle: true,
      backgroundColor: _dark,
      titleTextStyle: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.w500,
        color: _light.withOpacity(_textColorOpacityPrimary),
      ),
      iconTheme: IconThemeData(
        color: _light.withOpacity(_textColorOpacitySecondary),
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
      secondary: _secondaryDark,
      surface: _lighterDark,
    ),
    primaryColor: _primaryDark,
    primaryColorLight: _primaryDark,
    primaryColorDark: _primaryLight,
    primarySwatch: _swatchDark,
    scaffoldBackgroundColor: _dark,
    toggleableActiveColor: _primaryDark,
    cardColor: _lighterDark,
    inputDecorationTheme: InputDecorationTheme(
      contentPadding: EdgeInsets.symmetric(vertical: 4, horizontal: 10),
      filled: true,
      fillColor: _dark,
      labelStyle: TextStyle(
        color: _light.withOpacity(0.7),
      ),
      errorStyle: TextStyle(
        color: _errorDark,
      ),
      border: UnderlineInputBorder(
          borderRadius:
              BorderRadius.only(topLeft: Radius.circular(_radius), topRight: Radius.circular(_radius)),
          borderSide: BorderSide(
            color: _light,
            width: 1.8,
          )),
      enabledBorder: UnderlineInputBorder(
          borderRadius:
              BorderRadius.only(topLeft: Radius.circular(_radius), topRight: Radius.circular(_radius)),
          borderSide: BorderSide(
            color: _light,
            width: 1.8,
          )),
      errorBorder: UnderlineInputBorder(
        borderRadius:
            BorderRadius.only(topLeft: Radius.circular(_radius), topRight: Radius.circular(_radius)),
        borderSide: BorderSide(
          color: _errorDark,
          width: 1.8,
        ),
      ),
    ),
    textTheme: TextTheme(
      headline1: _textColorTitleDark,
      headline2: _textColorTitleDark,
      headline3: _textColorTitleDark,
      headline4: _textColorTitleDark,
      headline5: _textColorTitleDark,
      headline6: _textColorTitleDark,
      subtitle1: _textColorTitleDark,
      subtitle2: _textColorDark,
      bodyText1: _textColorDark,
      bodyText2: _textColorDark,
      caption: _textColorDark,
    ),
    cardTheme: CardTheme(
        shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(10)),
    )),
    snackBarTheme: SnackBarThemeData(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(_radius)),
      ),
      backgroundColor: _lighterLight,
      behavior: SnackBarBehavior.floating,
    ),
    navigationBarTheme: NavigationBarThemeData(
      height: 73,
      backgroundColor: _lighterDark,
      indicatorColor: _primaryDark,
      iconTheme: MaterialStateProperty.resolveWith((states) {
        if (states.contains(MaterialState.selected)) {
          return IconThemeData(
            color: _lighterDark,
            size: 25,
          );
        } else {
          return IconThemeData(
            color: _light,
            size: 25,
          );
        }
      }),
      labelTextStyle: MaterialStateProperty.all(TextStyle(
        color: _light,
        fontSize: 15,
        fontWeight: FontWeight.w600,
      )),
    ),
  );
}
