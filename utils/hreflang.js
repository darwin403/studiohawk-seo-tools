export default function hreflang(languageCode, countryCode) {
  return languageCode
    ? countryCode
      ? `${languageCode}-${countryCode}`
      : languageCode
    : "x-default";
}
