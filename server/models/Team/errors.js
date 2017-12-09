/**
 * Errors associated with a Team. Note the standard format
 */

const prefix = 'team';

export const noTeamError = {
  code: `${prefix}_not_found`,
  message: 'Could not find team.',
};

export const nameError = {
  code: `${prefix}_invalid_name`,
  message: 'Please enter a valid team',
};
