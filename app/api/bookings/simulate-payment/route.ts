import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAdminWhatsAppNotification } from "@/lib/whatsapp";
import { sendBookingEmails } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { referenceCode } = await req.json();

    if (!referenceCode) {
      return NextResponse.json({ error: "Reference code required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { referenceCode },
      include: { service: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Determine amount paid based on choice
    const retainerPercent = booking.service.retainerPercentage || 30.0;
    const paidAmount =
      booking.paymentChoice === "FULL_100"
        ? booking.totalAmount
        : Math.round((booking.totalAmount * (retainerPercent / 100)) * 100) / 100;
    const balance = Math.round((booking.totalAmount - paidAmount) * 100) / 100;

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "CONFIRMED",
        amountPaid: paidAmount,
        balanceDue: balance,
        payfastPaymentId: `SANDBOX-${Date.now()}`,
      },
      include: { service: true },
    });

    // Record mock payment
    await prisma.paymentTransaction.create({
      data: {
        bookingId: booking.id,
        pfPaymentId: updated.payfastPaymentId,
        paymentStatus: "COMPLETE",
        amountGross: paidAmount,
        signatureValid: true,
        rawPayload: "SIMULATED_SANDBOX_CONFIRMATION",
      },
    });

    // Trigger WhatsApp & Email
    await sendAdminWhatsAppNotification({
      referenceCode: updated.referenceCode,
      patientName: updated.patientName,
      patientPhone: updated.patientPhone,
      serviceName: updated.service.name,
      appointmentDate: updated.appointmentDate,
      timeSlot: updated.timeSlot,
      address: updated.patientAddress,
      paymentType: updated.paymentChoice,
      amountPaid: updated.amountPaid,
      balanceDue: updated.balanceDue,
      medicalNotes: updated.medicalNotes,
    });

    await sendBookingEmails({
      referenceCode: updated.referenceCode,
      patientName: updated.patientName,
      patientEmail: updated.patientEmail,
      patientPhone: updated.patientPhone,
      serviceName: updated.service.name,
      appointmentDate: updated.appointmentDate,
      timeSlot: updated.timeSlot,
      address: updated.patientAddress,
      paymentType: updated.paymentChoice,
      amountPaid: updated.amountPaid,
      balanceDue: updated.balanceDue,
      prepInstructions: updated.service.prepInstructions,
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    console.error("Simulation error:", error);
    return NextResponse.json({ error: "Failed to simulate confirmation" }, { status: 500 });
  }
}
