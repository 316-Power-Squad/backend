'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateUser = exports.newUser = undefined;

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _passwordValidator = require('password-validator');

var _passwordValidator2 = _interopRequireDefault(_passwordValidator);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _emailValidator = require('email-validator');

var _emailValidator2 = _interopRequireDefault(_emailValidator);

var _db = require('../../helpers/db');

var _db2 = _interopRequireDefault(_db);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var passwordValidator = new _passwordValidator2.default().is().min(10).has().uppercase().has().symbols();

var newUser = exports.newUser = function newUser(name, email, password, done) {
  if (!passwordValidator.validate(password)) {
    done({}, _errors.passwordValidationError);
  } else if (!_emailValidator2.default.validate(email)) {
    done({}, _errors.emailValidationError);
  } else {
    _bcrypt2.default.hash(password, 10, function (err, hash) {
      if (err) done({}, _errors.hashingError);else {
        _db2.default.get().query('INSERT INTO User (name, email, hash) values (?, ?, ?)', [name, email, hash], function (err, result) {
          done({}, err);
        });
      }
    });
  }
};

var validateUser = exports.validateUser = function validateUser(email, password, done) {
  _db2.default.get().query('SELECT * FROM User WHERE email=?', [email], function (err, rows) {
    if (err) done(false, sqlError);else if (rows.length === 0) {
      done({}, _errors.noUserError);
    } else {
      _bcrypt2.default.compare(password, rows[0].hash, function (err, res) {
        if (res) {
          // We have a valid user...pass them a signed JWT token
          var token = _jsonwebtoken2.default.sign(rows[0].hash, process.env.JWT_SECRET);
          done({
            user: {
              email: rows[0].email,
              name: rows[0].name
            },
            token: token
          });
        } else {
          done({ valid: false }, _errors.invalidPasswordError);
        }
      });
    }
  });
};

exports.default = {
  newUser: newUser,
  validateUser: validateUser
};
//# sourceMappingURL=User.js.map