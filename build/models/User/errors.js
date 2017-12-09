'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var prefix = 'user';

var hashingError = exports.hashingError = {
  code: prefix + '_hash_failed',
  message: 'Could not process the given password'
};

var noUserError = exports.noUserError = {
  code: prefix + '_no_user',
  message: 'Could not find user'
};

var emailValidationError = exports.emailValidationError = {
  code: prefix + '_email_validation',
  message: 'Invalid email address'
};

var passwordValidationError = exports.passwordValidationError = {
  code: prefix + '_password_validation',
  message: 'Password must contain a capital letter, a special character, and at least 10 characters'
};

var invalidPasswordError = exports.invalidPasswordError = {
  code: prefix + '_invalid_password',
  message: 'Email or password was incorrect'
};
//# sourceMappingURL=errors.js.map