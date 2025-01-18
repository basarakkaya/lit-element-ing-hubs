import i18n from '../services/i18n';

export function formatDate(dateISOString) {
  const date = new Date(dateISOString);
  return date.toLocaleDateString(i18n.currentLanguage);
}
