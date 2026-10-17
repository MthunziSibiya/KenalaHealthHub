export interface WhatsAppBookingNotification {
  referenceCode: string;
  patientName: string;
  patientPhone: string;
  serviceName: string;
  appointmentDate: string;
  timeSlot: string;
  address: string;
  paymentType: string;
  amountPaid: number;
  balanceDue: number;
  medicalNotes?: string | null;
}

export async function sendAdminWhatsAppNotification(data: WhatsAppBookingNotification) {
  const adminNumber = process.env.ADMIN_NOTIFICATION_WHATSAPP || "27790118464"; // Sr Grace
  const formattedAmount = `R${data.amountPaid.toFixed(2)}`;
  const formattedBalance = `R${data.balanceDue.toFixed(2)}`;

  const messageBody = `🚨 *NEW BOOKING CONFIRMED — KENALA HEALTH HUB*\n\n` +
    `📋 *Ref:* ${data.referenceCode}\n` +
    `🩺 *Service:* ${data.serviceName}\n` +
    `📅 *Date:* ${data.appointmentDate}\n` +
    `⏰ *Time Slot:* ${data.timeSlot}\n\n` +
    `👤 *Patient:* ${data.patientName}\n` +
    `📞 *Phone:* ${data.patientPhone}\n` +
    `📍 *Address:* ${data.address}\n\n` +
    `💳 *Payment:* ${data.paymentType === "FULL_100" ? "Full Payment (100%)" : "30% Retainer Deposit"}\n` +
    `✅ *Paid via PayFast:* ${formattedAmount}\n` +
    `💵 *Balance Due on Visit:* ${formattedBalance}\n` +
    (data.medicalNotes ? `📝 *Notes:* ${data.medicalNotes}\n\n` : `\n`) +
    `_Care • Compassion • Community_`;

  console.log(`[WhatsApp Service] Dispatching alert to Admin (${adminNumber}):`);
  console.log(messageBody);

  // If Twilio API credentials are configured, execute direct server-side API call
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. "whatsapp:+14155238886"

  if (accountSid && authToken && fromNumber) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const toNumber = adminNumber.startsWith("+") ? `whatsapp:${adminNumber}` : `whatsapp:+${adminNumber}`;

      const params = new URLSearchParams();
      params.append("From", fromNumber);
      params.append("To", toNumber);
      params.append("Body", messageBody);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[WhatsApp Twilio Error]:", errorText);
        return { success: false, error: errorText };
      }

      const result = await response.json();
      console.log("[WhatsApp Twilio Success]: Message SID", result.sid);
      return { success: true, sid: result.sid };
    } catch (err: any) {
      console.error("[WhatsApp Exception]:", err.message);
      return { success: false, error: err.message };
    }
  }

  // Graceful development mode
  return {
    success: true,
    mock: true,
    message: "Twilio credentials pending. Dispatched via server log and fallback URL.",
  };
}

export function generateDirectWhatsAppLink(data: WhatsAppBookingNotification): string {
  const adminNumber = process.env.ADMIN_NOTIFICATION_WHATSAPP || "27790118464";
  const text = `Hello Sr Grace, I have reserved appointment ${data.referenceCode} for ${data.serviceName} on ${data.appointmentDate} at ${data.timeSlot}. Thank you!`;
  return `https://wa.me/${adminNumber}?text=${encodeURIComponent(text)}`;
}
