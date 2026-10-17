import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePayFastSignature } from "@/lib/payfast";
import { sendAdminWhatsAppNotification } from "@/lib/whatsapp";
import { sendBookingEmails } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const params = new URLSearchParams(rawBody);
    const data: Record<string, string> = {};

    params.forEach((value, key) => {
      data[key] = value;
    });

    console.log("[PayFast ITN Received]:", data);

    const receivedSignature = data.signature;
    const passphrase = process.env.PAYFAST_PASSPHRASE || "jt7NOE43FZPn";

    // Verify signature
    const calculatedSignature = generatePayFastSignature(data, passphrase);
    const isSignatureValid = receivedSignature?.toLowerCase() === calculatedSignature.toLowerCase();

    const paymentStatus = data.payment_status || "UNKNOWN";
    const bookingRef = data.m_payment_id;
    const pfPaymentId = data.pf_payment_id || null;
    const amountGross = parseFloat(data.amount_gross || "0");
    const amountFee = data.amount_fee ? parseFloat(data.amount_fee) : null;
    const amountNet = data.amount_net ? parseFloat(data.amount_net) : null;

    if (!bookingRef) {
      return new Response("Missing booking reference", { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { referenceCode: bookingRef },
      include: { service: true },
    });

    if (!booking) {
      return new Response("Booking not found", { status: 404 });
    }

    // Record Payment Transaction
    await prisma.paymentTransaction.create({
      data: {
        bookingId: booking.id,
        pfPaymentId,
        paymentStatus,
        amountGross,
        amountFee,
        amountNet,
        signatureValid: isSignatureValid,
        rawPayload: rawBody,
      },
    });

    // If payment is COMPLETE, confirm booking and trigger notifications
    if (paymentStatus === "COMPLETE") {
      const updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: "CONFIRMED",
          amountPaid: amountGross,
          balanceDue: Math.max(0, Math.round((booking.totalAmount - amountGross) * 100) / 100),
          payfastPaymentId: pfPaymentId,
        },
        include: { service: true },
      });

      // 1. Dispatch WhatsApp notification to Admin & Patient
      await sendAdminWhatsAppNotification({
        referenceCode: updatedBooking.referenceCode,
        patientName: updatedBooking.patientName,
        patientPhone: updatedBooking.patientPhone,
        serviceName: updatedBooking.service.name,
        appointmentDate: updatedBooking.appointmentDate,
        timeSlot: updatedBooking.timeSlot,
        address: updatedBooking.patientAddress,
        paymentType: updatedBooking.paymentChoice,
        amountPaid: updatedBooking.amountPaid,
        balanceDue: updatedBooking.balanceDue,
        medicalNotes: updatedBooking.medicalNotes,
      });

      // 2. Dispatch Confirmation Emails
      await sendBookingEmails({
        referenceCode: updatedBooking.referenceCode,
        patientName: updatedBooking.patientName,
        patientEmail: updatedBooking.patientEmail,
        patientPhone: updatedBooking.patientPhone,
        serviceName: updatedBooking.service.name,
        appointmentDate: updatedBooking.appointmentDate,
        timeSlot: updatedBooking.timeSlot,
        address: updatedBooking.patientAddress,
        paymentType: updatedBooking.paymentChoice,
        amountPaid: updatedBooking.amountPaid,
        balanceDue: updatedBooking.balanceDue,
        prepInstructions: updatedBooking.service.prepInstructions,
      });
    }

    // PayFast requires a 200 OK response
    return new Response("OK", { status: 200 });
  } catch (error: any) {
    console.error("[PayFast ITN Handler Error]:", error);
    return new Response("Server error handling ITN", { status: 500 });
  }
}
