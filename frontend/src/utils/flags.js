export function getFlagUrl(countryCode) {
  if (countryCode === "EU") {
    return "https://flagcdn.com/w40/eu.png"
  }
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
}