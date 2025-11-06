export const validateMobileNumber = (number) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(number);
};

export const validateName = (name) => {
  return typeof name === 'string' && name.trim().length >= 3;
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
