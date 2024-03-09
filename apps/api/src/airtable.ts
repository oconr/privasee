import Airtable from "airtable";

if (!process.env.AIRTABLE_APP_ID) {
  throw new Error("Missing AIRTABLE_APP_ID");
}

if (!process.env.AIRTABLE_API_KEY) {
  throw new Error("Missing AIRTABLE_API_KEY");
}

const base = Airtable.base(process.env.AIRTABLE_APP_ID);

export default base;
