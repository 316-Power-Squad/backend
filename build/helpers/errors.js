'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var sqlError = exports.sqlError = {
  code: 'sql_error',
  message: 'Error in the sql layer of the application'
};

var jwtAuthError = exports.jwtAuthError = {
  code: 'jwt_auth_error',
  message: 'Failed to authenticate jwt token'
};

var jwtNotProvidedError = exports.jwtNotProvidedError = {
  code: 'jwt_not_provided',
  message: 'JWT token not provided in authentication call'
};
//# sourceMappingURL=errors.js.map