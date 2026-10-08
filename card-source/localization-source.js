// Text is stored in custom_components/irrigation_schedule/locales/*.json.
const languageCode = value => {
  const code = String(value || 'en').toLowerCase().split(/[-_]/)[0];
  return Object.hasOwn(IRRIGATION_TRANSLATIONS, code) ? code : 'en';
};
const translate = (language, key, params = {}) => {
  const text = IRRIGATION_TRANSLATIONS[languageCode(language)][key] ?? IRRIGATION_TRANSLATIONS.en[key] ?? key;
  return typeof text === 'string' ? text.replace(/\{(\w+)\}/g, (match, name) => params[name] == null ? match : String(params[name])) : text;
};
