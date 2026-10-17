import { Resend } from "resend";

export interface EmailBookingPayload {
  referenceCode: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  serviceName: string;
  appointmentDate: string;
  timeSlot: string;
  address: string;
  paymentType: string;
  amountPaid: number;
  balanceDue: number;
  prepInstructions?: string | null;
}

export async function sendBookingEmails(data: EmailBookingPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Kenala Health Hub <noreply@kenalahealthhub.co.za>";
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "info@kenalahealthhub.co.za";

  const patientHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #111111; padding: 28px 24px; text-align: center; border-bottom: 4px solid #B81D24;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">
          <span style="color: #B81D24; font-style: italic;">Kenala</span> HEALTH HUB
        </h1>
        <p style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 11px; letter-spacing: 2px;">CARE • COMPASSION • COMMUNITY</p>
      </div>
      
      <div style="padding: 32px 24px;">
        <div style="background: #F8FAFC; border-left: 4px solid #B81D24; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
          <h2 style="color: #0f172a; margin: 0 0 8px 0; font-size: 18px;">Booking Confirmed</h2>
          <p style="color: #475569; margin: 0; font-size: 14px;">
            Dear <strong>${data.patientName}</strong>, your healthcare appointment has been successfully reserved.
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Booking Reference:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #B81D24; text-align: right;">${data.referenceCode}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Clinical Service:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a; text-align: right;">${data.serviceName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Date & Time:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a; text-align: right;">${data.appointmentDate} at ${data.timeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Payment Status:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #16a34a; text-align: right;">
              Paid R${data.amountPaid.toFixed(2)} (${data.paymentType === "FULL_100" ? "Full Payment" : "30% Retainer Deposit"})
            </td>
          </tr>
          ${
            data.balanceDue > 0
              ? `<tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Balance Due on Visit:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #d97706; text-align: right;">R${data.balanceDue.toFixed(2)}</td>
                </tr>`
              : ""
          }
        </table>

        ${
          data.prepInstructions
            ? `<div style="background: #FEF2F2; border: 1px solid #FEE2E2; padding: 14px; border-radius: 8px; margin-bottom: 24px;">
                <strong style="color: #991B1B; font-size: 13px; display: block; margin-bottom: 4px;">Important Preparation Instructions:</strong>
                <span style="color: #7F1D1D; font-size: 13px;">${data.prepInstructions}</span>
              </div>`
            : ""
        }

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 13px; color: #64748b;">
          <p style="margin: 0 0 6px 0;"><strong>Clinic Location:</strong> Corner Love drive & Alwyn str, ext 4, Nellmapius</p>
          <p style="margin: 0 0 6px 0;"><strong>Nurse In Charge:</strong> Sr Grace (079 559 7208)</p>
          <p style="margin: 0;"><strong>Official WhatsApp:</strong> 079 011 8464</p>
        </div>
      </div>
      
      <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
        Your health, OUR PRIORITY. • Kenala Health Hub © ${new Date().getFullYear()}
      </div>
    </div>
  `;

  if (!apiKey) {
    console.log(`[Email Service] Resend API key pending. Mocking email to ${data.patientEmail} & ${adminEmail}`);
    return { success: true, mock: true };
  }

  try {
    const resend = new Resend(apiKey);

    // 1. Send confirmation to Patient
    await resend.emails.send({
      from: fromEmail,
      to: data.patientEmail,
      subject: `Booking Confirmed: ${data.serviceName} (${data.referenceCode}) - Kenala Health Hub`,
      html: patientHtml,
    });

    // 2. Send notification to Admin
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `🚨 New Appointment: ${data.patientName} - ${data.serviceName} [${data.referenceCode}]`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Appointment Confirmed</h2>
          <p><strong>Reference:</strong> ${data.referenceCode}</p>
          <p><strong>Patient:</strong> ${data.patientName} (${data.patientPhone}, ${data.patientEmail})</p>
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Date & Time:</strong> ${data.appointmentDate} at ${data.timeSlot}</p>
          <p><strong>Address:</strong> ${data.address}</p>
          <p><strong>Amount Paid via PayFast:</strong> R${data.amountPaid.toFixed(2)}</p>
          <p><strong>Balance Due on Arrival:</strong> R${data.balanceDue.toFixed(2)}</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error("[Email Error]:", error.message);
    return { success: false, error: error.message };
  }
}
