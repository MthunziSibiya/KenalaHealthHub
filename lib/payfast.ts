import crypto from "crypto";

export interface PayFastPaymentData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  cell_number: string;
  m_payment_id: string; // Booking reference code
  amount: string; // "150.00"
  item_name: string;
  item_description?: string;
  custom_str1?: string; // Booking ID
  custom_str2?: string; // Payment choice: RETAINER_30 or FULL_100
  signature?: string;
}

/**
 * Accurately replicates PHP's urlencode() in Node.js for PayFast.
 * - Spaces are converted to '+'
 * - '!', "'", '(', ')', '*' are encoded to uppercase percent-encoding (%21, %27, %28, %29, %2A)
 * - All percent-encoded hex sequences are normalized to uppercase (e.g. %3a -> %3A)
 */
export function phpUrlEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/%20/g, "+")
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A")
    .replace(/%[0-9a-f]{2}/g, (match) => match.toUpperCase());
}

export function generatePayFastSignature(
  data: Record<string, string | undefined>,
  passphrase?: string
): string {
  // 1. Filter out empty, null, undefined, and 'signature' itself
  const keys = Object.keys(data).filter(
    (key) => key !== "signature" && data[key] !== undefined && data[key] !== null && String(data[key]).trim() !== ""
  );

  // 2. Sort keys strictly in alphabetical order as required by PayFast
  keys.sort();

  // 3. Build the query string using exact PHP urlencode behavior
  let pfOutput = "";
  for (const key of keys) {
    const val = String(data[key]).trim();
    pfOutput += `${key}=${phpUrlEncode(val)}&`;
  }

  // 4. Remove trailing ampersand
  let getString = pfOutput.slice(0, -1);

  // 5. Append passphrase if configured (and not blank)
  if (passphrase && passphrase.trim() !== "") {
    getString += `&passphrase=${phpUrlEncode(passphrase.trim())}`;
  }

  return crypto.createHash("md5").update(getString).digest("hex");
}

export function getPayFastUrl(): string {
  const isSandbox = process.env.PAYFAST_SANDBOX !== "false";
  return isSandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";
}

export function getPayFastValidateUrl(): string {
  const isSandbox = process.env.PAYFAST_SANDBOX !== "false";
  return isSandbox
    ? "https://sandbox.payfast.co.za/eng/query/validate"
    : "https://www.payfast.co.za/eng/query/validate";
}
