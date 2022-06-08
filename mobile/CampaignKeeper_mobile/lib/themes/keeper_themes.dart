import 'package:flutter/material.dart';

// Theme data generator.
class _DefaultTheme {
  static const double _textColorOpacitySecondary = 0.7;
  static const double _textColorOpacityPrimary = 0.9;
  static const double _radius = 10.0;

  final Color surface;
  final Color background;
  final Color primary;
  final Color primaryDark;
  final Color secondary;
  final Color error;
  final Color onSurface;
  final Color onBackground;
  final Color onPrimary;
  final Color onSecondary;
  final Color onError;

  final Brightness brightness;

  final MaterialColor swatch;

  final TextStyle textColor;
  final TextStyle textColorTitle;

  late ThemeData theme = ThemeData(
    appBarTheme: AppBarTheme(
      elevation: 0.0,
      centerTitle: true,
      backgroundColor: background,
      titleTextStyle: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.w500,
        color: onBackground.withOpacity(_textColorOpacityPrimary),
      ),
      iconTheme: IconThemeData(
        color: onBackground.withOpacity(_textColorOpacitySecondary),
      ),
    ),
    backgroundColor: background,
    colorScheme: ColorScheme(
      background: background,
      brightness: brightness,
      error: error,
      onBackground: onBackground,
      onError: onError,
      onPrimary: onPrimary,
      onSecondary: onSecondary,
      onSurface: onSurface,
      primary: primary,
      secondary: secondary,
      surface: surface,
    ),
    primaryColor: primary,
    primaryColorLight: primary,
    primaryColorDark: primaryDark,
    primarySwatch: swatch,
    scaffoldBackgroundColor: background,
    toggleableActiveColor: primary,
    cardColor: surface,
    inputDecorationTheme: InputDecorationTheme(
      contentPadding: EdgeInsets.symmetric(vertical: 4, horizontal: 10),
      filled: true,
      fillColor: background,
      labelStyle: TextStyle(
        color: onBackground.withOpacity(_textColorOpacitySecondary),
      ),
      errorStyle: TextStyle(
        color: error,
      ),
      border: UnderlineInputBorder(
          borderRadius:
              BorderRadius.only(topLeft: Radius.circular(_radius), topRight: Radius.circular(_radius)),
          borderSide: BorderSide(
            color: onBackground,
            width: 1.8,
          )),
      enabledBorder: UnderlineInputBorder(
          borderRadius:
              BorderRadius.only(topLeft: Radius.circular(_radius), topRight: Radius.circular(_radius)),
          borderSide: BorderSide(
            color: onBackground,
            width: 1.8,
          )),
      errorBorder: UnderlineInputBorder(
        borderRadius:
            BorderRadius.only(topLeft: Radius.circular(_radius), topRight: Radius.circular(_radius)),
        borderSide: BorderSide(
          color: error,
          width: 1.8,
        ),
      ),
    ),
    textTheme: TextTheme(
      headline1: textColorTitle,
      headline2: textColorTitle,
      headline3: textColorTitle,
      headline4: textColorTitle,
      headline5: textColorTitle,
      headline6: textColorTitle,
      subtitle1: textColorTitle,
      subtitle2: textColor,
      bodyText1: textColor,
      bodyText2: textColor,
      caption: textColor,
    ),
    cardTheme: CardTheme(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(_radius)),
      ),
      elevation: 0,
    ),
    snackBarTheme: SnackBarThemeData(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(_radius)),
      ),
      behavior: SnackBarBehavior.floating,
      backgroundColor: onSurface,
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: surface,
      indicatorColor: primary,
      iconTheme: MaterialStateProperty.resolveWith((states) {
        Color color = states.contains(MaterialState.selected) ? onPrimary : onSurface;

        return IconThemeData(
          color: color,
          size: 25,
        );
      }),
      labelTextStyle: MaterialStateProperty.all(TextStyle(
        color: onSurface,
        fontSize: 15,
        fontWeight: FontWeight.w600,
      )),
    ),
    highlightColor: onSurface.withOpacity(0.05),
    splashColor: onSurface.withOpacity(0.1),
  );

  _DefaultTheme({
    required this.surface,
    required this.background,
    required this.primary,
    required this.primaryDark,
    required this.secondary,
    required this.error,
    required this.onSurface,
    required this.onBackground,
    required this.onPrimary,
    required this.onSecondary,
    required this.onError,
    required this.brightness,
  })  : swatch = MaterialColor(primary.value, <int, Color>{
          50: primary,
          100: primary,
          200: primary,
          300: primary,
          400: primary,
          500: primary,
          600: primary,
          700: primary,
          800: primary,
          900: primary,
        }),
        textColor = TextStyle(
          color: onBackground.withOpacity(_textColorOpacitySecondary),
        ),
        textColorTitle = TextStyle(
          color: onBackground.withOpacity(_textColorOpacityPrimary),
        );
}

// Apps theme provider.
class KeeperThemes {
  static const Color _primaryLight = Color(0xfff0c84c);
  static const Color _onPrimaryLight = Color(0xff242424);

  static final Color _secondaryLight = Color(0xff09efc9);
  static const Color _onSecondaryLight = Color(0xff242424);

  static const Color _errorLight = Colors.redAccent;
  static const Color _onErrorLight = Color(0xff242424);

  static const Color _light = Color(0xffe1edfa);
  static const Color _lighterLight = Color.fromARGB(255, 241, 250, 255);

  static const Color _primaryDark = Color(0xffffe082);
  static const Color _onPrimaryDark = Color(0xff242424);

  static const Color _secondaryDark = Color(0xffa5c8e8);
  static const Color _onSecondaryDark = Color(0xff242424);

  static const Color _errorDark = Colors.redAccent;
  static const Color _onErrorDark = Color(0xff242424);

  static const Color _dark = Color(0xff262E38);
  static const Color _lighterDark = Color(0xff303d50);

  static final ThemeData light = _DefaultTheme(
          surface: _light,
          background: _lighterLight,
          primary: _primaryLight,
          primaryDark: _primaryDark,
          secondary: _secondaryLight,
          error: _errorLight,
          onSurface: _dark,
          onBackground: _lighterDark,
          onPrimary: _onPrimaryLight,
          onSecondary: _onSecondaryLight,
          onError: _onErrorLight,
          brightness: Brightness.light)
      .theme;

  static final ThemeData dark = _DefaultTheme(
          surface: _lighterDark,
          background: _dark,
          primary: _primaryDark,
          primaryDark: _primaryLight,
          secondary: _secondaryDark,
          error: _errorDark,
          onSurface: _lighterLight,
          onBackground: _light,
          onPrimary: _onPrimaryDark,
          onSecondary: _onSecondaryDark,
          onError: _onErrorDark,
          brightness: Brightness.dark)
      .theme;
}
