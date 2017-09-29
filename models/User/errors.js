const prefix = 'user';

export const hashingError = {
  code: `${prefix}_hash_failed`,
  message: 'Could not process the given password',
};

export const usernameValidationError = {
  code: `${prefix}_password_validation`,
  message:
    'Username cannot contain capital letters, spaces, or special characters',
};

export const passwordValidationError = {
  code: `${prefix}_username_validation`,
  message:
    'Password must contain a capital letter, a special character, and at least 10 characters',
};

export const invalidPasswordError = {
  code: `${prefix}_invalid_password`,
  message: 'Username or password was incorrect',
};
