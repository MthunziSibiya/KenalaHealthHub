import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalBookings = await prisma.booking.count();
    const confirmedBookings = await prisma.booking.count({ where: { status: "CONFIRMED" } });
    const pendingBookings = await prisma.booking.count({ where: { status: "PENDING_PAYMENT" } });
    const completedBookings = await prisma.booking.count({ where: { status: "COMPLETED" } });

    const paidSums = await prisma.booking.aggregate({
      _sum: {
        amountPaid: true,
        balanceDue: true,
      },
      where: {
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
    });

    const recentBookings = await prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { service: true },
    });

    return NextResponse.json({
      metrics: {
        totalBookings,
        confirmedBookings,
        pendingBookings,
        completedBookings,
        totalRevenueCollected: paidSums._sum.amountPaid || 0,
        totalPendingBalance: paidSums._sum.balanceDue || 0,
      },
      recentBookings,
    });
  } catch (error: any) {
    console.error("Metrics API error:", error);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
