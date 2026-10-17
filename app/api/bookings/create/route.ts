import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePayFastSignature, getPayFastUrl } from "@/lib/payfast";

function generateRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `KHH-${new Date().getFullYear().toString().slice(-2)}${random}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      serviceId,
      patientName,
      patientPhone,
      patientEmail,
      patientAddress,
      area = "Nellmapius",
      appointmentDate,
      timeSlot,
      paymentChoice = "RETAINER_30",
      medicalNotes,
    } = body;

    // Validate mandatory fields
    if (!serviceId || !patientName || !patientPhone || !patientEmail || !patientAddress || !appointmentDate || !timeSlot) {
      return NextResponse.json(
        { error: "Please fill in all mandatory appointment fields." },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || !service.isActive) {
      return NextResponse.json(
        { error: "Selected clinical service is currently unavailable." },
        { status: 404 }
      );
    }

    const totalAmount = service.price;
    const retainerPercent = service.retainerPercentage || 30.0;

    let amountToPay = 0;
    let balanceDue = 0;

    if (paymentChoice === "FULL_100") {
      amountToPay = totalAmount;
      balanceDue = 0.0;
    } else {
      amountToPay = Math.round((totalAmount * (retainerPercent / 100)) * 100) / 100;
      balanceDue = Math.round((totalAmount - amountToPay) * 100) / 100;
    }

    const referenceCode = generateRefCode();

    const booking = await prisma.booking.create({
      data: {
        referenceCode,
        serviceId: service.id,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.toLowerCase().trim(),
        patientAddress: patientAddress.trim(),
        area: area.trim(),
        appointmentDate,
        timeSlot,
        paymentChoice,
        totalAmount,
        amountPaid: 0.0,
        balanceDue,
        status: "PENDING_PAYMENT",
        medicalNotes: medicalNotes?.trim() || null,
      },
      include: {
        service: true,
      },
    });

    // Prepare PayFast parameters
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const merchantId = process.env.PAYFAST_MERCHANT_ID || "10000100";
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a";
    const passphrase = process.env.PAYFAST_PASSPHRASE || "jt7NOE43FZPn";

    const nameParts = patientName.trim().split(" ");
    const nameFirst = nameParts[0] || "Patient";
    const nameLast = nameParts.slice(1).join(" ") || "Client";

    const payfastData: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${appUrl}/booking-success?ref=${referenceCode}`,
      cancel_url: `${appUrl}/?cancelled=${referenceCode}`,
      notify_url: `${appUrl}/api/payfast/itn`,
      name_first: nameFirst,
      name_last: nameLast,
      email_address: patientEmail.toLowerCase().trim(),
      cell_number: patientPhone.trim(),
      m_payment_id: referenceCode,
      amount: amountToPay.toFixed(2),
      item_name: `Kenala Health Hub: ${service.name} (${paymentChoice === "FULL_100" ? "Full Fee" : "30% Retainer"})`,
      item_description: `Appointment on ${appointmentDate} at ${timeSlot} for ${patientName}`,
      custom_str1: booking.id,
      custom_str2: paymentChoice,
    };

    const signature = generatePayFastSignature(payfastData, passphrase);
    payfastData.signature = signature;

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        referenceCode: booking.referenceCode,
        serviceName: service.name,
        appointmentDate: booking.appointmentDate,
        timeSlot: booking.timeSlot,
        amountToPay,
        balanceDue,
        paymentChoice,
      },
      payfastUrl: getPayFastUrl(),
      payfastData,
    });
  } catch (error: any) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Failed to initialize booking session." },
      { status: 500 }
    );
  }
}
