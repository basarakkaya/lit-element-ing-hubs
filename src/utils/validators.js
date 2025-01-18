import i18n from '../services/i18n';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(5\d{2})\d{7}$/;

export function validateEmployeeForm(employee) {
  const errors = {};

  Object.entries(employee).forEach(([key, value]) => {
    if (!value) {
      errors[key] = i18n.t('employees.validation.required');
    }
  });

  if (employee.email && !emailRegex.test(employee.email)) {
    errors.email = i18n.t('employees.validation.invalidEmail');
  }

  if (employee.phoneNumber && !phoneRegex.test(employee.phoneNumber)) {
    errors.phoneNumber = i18n.t('employees.validation.invalidPhone');
  }

  return errors;
}
