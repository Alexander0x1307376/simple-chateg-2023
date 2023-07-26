export const TYPES = {
  Application: Symbol.for("Application"),
  EnvironmentService: Symbol.for("EnvironmentService"),
  DataSource: Symbol.for("DataSource"),
  Logger: Symbol.for("Logger"),

  MainController: Symbol.for("MainController"),

  AuthController: Symbol.for("AuthController"),
  AuthMiddleware: Symbol.for("AuthMiddleware"),
  AuthService: Symbol.for("AuthService"),

  ExceptionFilter: Symbol.for("ExceptionFilter"),

  UsersController: Symbol.for("UsersController"),
  UsersService: Symbol.for("UsersService"),
};
