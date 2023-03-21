import validator from 'validator';
// setIsError('Too many failed login attempts. Please try again in 15 minutes')
// Use some columns in your users table 'failed_login_attempts' and 'failed_login_time'.
// The first one increments per failed login, and resets on successful login.
// The second one allows you to compare the current time with the last failed time.
// Your code can use this data in the db to determine how long it waits to lock out users,
//  time between allowed logins etc
export const loginValidation = inputs => {
  if (validator.isEmpty(inputs.email)) {
    return { isValidated: false, message: 'Email address field is required!' };
  }

  if (!validator.isEmail(inputs.email)) {
    return { isValidated: false, message: 'Invalid email address!' };
  }

  if (validator.isEmpty(inputs.password)) {
    return { isValidated: false, message: 'Password field is required!' };
  }

  if (inputs.password.trim().length < 6) {
    return {
      isValidated: false,
      message: 'Your Password must be at least 6 characters'
    };
  }

  return { isValidated: true, message: '' };
};
