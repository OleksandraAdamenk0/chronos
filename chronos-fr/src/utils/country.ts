export async function getCountryCodeByName(countryName: string): Promise<string> {
  const url = `https://restcountries.com/v3.1/name/${countryName}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch country code for ${countryName}`);
  }
  const data = await response.json();
  if (!data || !data[0] || !data[0].cca2) {
    throw new Error(`Country code not found for ${countryName}`);
  }
  return data[0].cca2;
}