import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const query = searchParams.get("q");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    if (query) {
      where.OR = [
        { referenceCode: { contains: query } },
        { patientName: { contains: query } },
        { patientPhone: { contains: query } },
        { patientEmail: { contains: query } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { service: true, payments: true },
    });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error("Admin bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status, appointmentDate, timeSlot, medicalNotes } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (appointmentDate) updateData.appointmentDate = appointmentDate;
    if (timeSlot) updateData.timeSlot = timeSlot;
    if (medicalNotes !== undefined) updateData.medicalNotes = medicalNotes;

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: { service: true },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    console.error("Booking update error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
