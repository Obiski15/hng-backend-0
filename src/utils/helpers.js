CAT_FACT_URL = "https://catfact.ninja/fact";

async function getFact() {
  const response = await fetch(CAT_FACT_URL);
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch cat fact");
  }

  return data;
}

module.exports = getFact;
