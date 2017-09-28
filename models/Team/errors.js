/**
 * Errors associated with a Team. Note the standard format
 */

const prefix = 'team';

export const noTeamError = {
  id: `${prefix}_not_found`,
  message: 'Could not find team.',
};

export const nameError = {
  id: `${prefix}_invalid_name`,
  message: 'Please enter a valid team',
};
