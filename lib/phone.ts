/**
 * Kenala Health Hub - Phone Validation & Formatting Utilities
 * Handles South African (and international) phone numbers for UI, Database, WhatsApp, and PayFast.
 */

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  cleanDigits: string; // e.g. "0790118464" (10 digits)
  formatted: string; // e.g. "079 011 8464"
  payfastCellNumber: string; // strictly digits or +digits, no spaces, no punctuation
  whatsappNumber: string; // e.g. "27790118464"
}

/**
 * Validates a South African phone number (or international).
 * Accepts formats like:
 * - 079 011 8464
 * - 0790118464
 * - +27 79 011 8464
 * - +27790118464
 * - 27790118464
 */
export function validateSouthAfricanPhone(input: string): PhoneValidationResult {
  const trimmed = (input || "").trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: "Please enter your WhatsApp/cell phone number",
      cleanDigits: "",
      formatted: "",
      payfastCellNumber: "",
      whatsappNumber: "",
    };
  }

  // Reject text containing alphabetic or special characters other than +, spaces, hyphens, parentheses
  if (/[a-zA-Z]/.test(trimmed)) {
    return {
      isValid: false,
      error: "Phone number cannot contain letters. Please enter digits only.",
      cleanDigits: "",
      formatted: "",
      payfastCellNumber: "",
      whatsappNumber: "",
    };
  }

  if (!/^(\+)?[0-9\s\-()]+$/.test(trimmed)) {
    return {
      isValid: false,
      error: "Phone number contains invalid characters. Please use numbers only.",
      cleanDigits: "",
      formatted: "",
      payfastCellNumber: "",
      whatsappNumber: "",
    };
  }

  const rawDigits = trimmed.replace(/\D/g, "");

  // Scenario A: Starts with international South African prefix (+27 or 27)
  if (trimmed.startsWith("+27") || trimmed.startsWith("27")) {
    const localPart = rawDigits.startsWith("27") ? rawDigits.slice(2) : rawDigits;

    if (localPart.length < 9) {
      return {
        isValid: false,
        error: `Phone number is too short (${localPart.length}/9 digits after +27). Expected 9 digits.`,
        cleanDigits: "",
        formatted: trimmed,
        payfastCellNumber: "",
        whatsappNumber: "",
      };
    }

    if (localPart.length > 9) {
      return {
        isValid: false,
        error: `Phone number is too long (${localPart.length}/9 digits after +27). Expected 9 digits.`,
        cleanDigits: "",
        formatted: trimmed,
        payfastCellNumber: "",
        whatsappNumber: "",
      };
    }

    // First digit after 27 must be 1-8 (valid SA mobile / area code, e.g. 79, 82, 60, 12, etc.)
    if (!/^[1-8]/.test(localPart)) {
      return {
        isValid: false,
        error: "Invalid South African network prefix after +27.",
        cleanDigits: "",
        formatted: trimmed,
        payfastCellNumber: "",
        whatsappNumber: "",
      };
    }

    const standard10 = `0${localPart}`;
    const formatted = `${standard10.slice(0, 3)} ${standard10.slice(3, 6)} ${standard10.slice(6)}`;

    return {
      isValid: true,
      cleanDigits: standard10,
      formatted,
      payfastCellNumber: standard10,
      whatsappNumber: `27${localPart}`,
    };
  }

  // Scenario B: Other international number (starts with +)
  if (trimmed.startsWith("+")) {
    if (rawDigits.length < 9 || rawDigits.length > 15) {
      return {
        isValid: false,
        error: "International phone number must be between 9 and 15 digits.",
        cleanDigits: "",
        formatted: trimmed,
        payfastCellNumber: `+${rawDigits}`,
        whatsappNumber: rawDigits,
      };
    }

    return {
      isValid: true,
      cleanDigits: rawDigits,
      formatted: `+${rawDigits}`,
      payfastCellNumber: `+${rawDigits}`,
      whatsappNumber: rawDigits,
    };
  }

  // Scenario C: Local 10-digit South African number (must start with 0)
  if (!rawDigits.startsWith("0")) {
    return {
      isValid: false,
      error: "South African numbers must start with '0' (e.g. 079 011 8464) or '+27'.",
      cleanDigits: "",
      formatted: trimmed,
      payfastCellNumber: "",
      whatsappNumber: "",
    };
  }

  if (rawDigits.length < 10) {
    return {
      isValid: false,
      error: `Phone number is too short (${rawDigits.length}/10 digits). Expected 10 digits.`,
      cleanDigits: "",
      formatted: trimmed,
      payfastCellNumber: "",
      whatsappNumber: "",
    };
  }

  if (rawDigits.length > 10) {
    return {
      isValid: false,
      error: `Phone number is too long (${rawDigits.length}/10 digits). Expected 10 digits.`,
      cleanDigits: "",
      formatted: trimmed,
      payfastCellNumber: "",
      whatsappNumber: "",
    };
  }

  // Second digit must be 1-8 (valid SA prefix: 06X, 07X, 08X, 01X, 02X, 03X, 04X, 05X)
  if (!/^0[1-8]/.test(rawDigits)) {
    return {
      isValid: false,
      error: "Invalid South African area or cellular prefix (e.g. 06x, 07x, 08x, 01x).",
      cleanDigits: "",
      formatted: trimmed,
      payfastCellNumber: "",
      whatsappNumber: "",
    };
  }

  // Reject dummy repeated digits (e.g. 0000000000, 0111111111, 0777777777)
  if (/^0(\d)\1{8}$/.test(rawDigits)) {
    return {
      isValid: false,
      error: "Please enter a genuine, active cellular phone number.",
      cleanDigits: "",
      formatted: trimmed,
      payfastCellNumber: "",
      whatsappNumber: "",
    };
  }

  const formatted = `${rawDigits.slice(0, 3)} ${rawDigits.slice(3, 6)} ${rawDigits.slice(6)}`;

  return {
    isValid: true,
    cleanDigits: rawDigits,
    formatted,
    payfastCellNumber: rawDigits, // Standard 10-digit format (e.g. "0790118464") accepted by PayFast
    whatsappNumber: `27${rawDigits.slice(1)}`,
  };
}

/**
 * Formats user phone input as they type into the text field.
 * Strips disallowed characters and inserts readable grouping: 0XX XXX XXXX.
 */
export function formatPhoneAsYouType(input: string): string {
  if (!input) return "";

  const trimmed = input.trim();

  // If user is typing international +27
  if (trimmed.startsWith("+")) {
    const digits = trimmed.slice(1).replace(/\D/g, "");
    if (digits.startsWith("27")) {
      const rest = digits.slice(2, 11);
      if (rest.length <= 2) return `+27 ${rest}`;
      if (rest.length <= 5) return `+27 ${rest.slice(0, 2)} ${rest.slice(2)}`;
      return `+27 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5, 9)}`;
    }
    // Generic international
    return `+${digits.slice(0, 15)}`;
  }

  // If user typed 27 without + at start and > 2 chars
  const digitsOnly = trimmed.replace(/\D/g, "");
  if (digitsOnly.startsWith("27") && digitsOnly.length > 2 && !trimmed.startsWith("0")) {
    const rest = digitsOnly.slice(2, 11);
    if (rest.length <= 2) return `+27 ${rest}`;
    if (rest.length <= 5) return `+27 ${rest.slice(0, 2)} ${rest.slice(2)}`;
    return `+27 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5, 9)}`;
  }

  // Local SA number starting with 0 (or typing 0)
  const localDigits = digitsOnly.slice(0, 10);
  if (localDigits.length <= 3) return localDigits;
  if (localDigits.length <= 6) return `${localDigits.slice(0, 3)} ${localDigits.slice(3)}`;
  return `${localDigits.slice(0, 3)} ${localDigits.slice(3, 6)} ${localDigits.slice(6)}`;
}
