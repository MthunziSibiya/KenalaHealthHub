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

export function generatePayFastSignature(
  data: Record<string, string | undefined>,
  passphrase?: string
): string {
  // Sort and filter empty parameters
  let pfOutput = "";
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (key !== "signature" && data[key] !== undefined && data[key] !== "") {
        pfOutput += `${key}=${encodeURIComponent(data[key]!.trim()).replace(/%20/g, "+")}&`;
      }
    }
  }

  // Remove trailing ampersand
  let getString = pfOutput.slice(0, -1);
  if (passphrase) {
    getString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`;
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
