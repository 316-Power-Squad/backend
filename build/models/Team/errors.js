'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Errors associated with a Team. Note the standard format
 */

var prefix = 'team';

var noTeamError = exports.noTeamError = {
  code: prefix + '_not_found',
  message: 'Could not find team.'
};

var nameError = exports.nameError = {
  code: prefix + '_invalid_name',
  message: 'Please enter a valid team'
};
//# sourceMappingURL=errors.js.map