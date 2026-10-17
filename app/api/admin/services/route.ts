import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json({ services });
  } catch (error: any) {
    console.error("Services fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, price, retainerPercentage, isActive, prepInstructions } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Service ID required" }, { status: 400 });
    }

    const updateData: any = {};
    if (price !== undefined) updateData.price = parseFloat(price);
    if (retainerPercentage !== undefined) updateData.retainerPercentage = parseFloat(retainerPercentage);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (prepInstructions !== undefined) updateData.prepInstructions = prepInstructions;

    const updated = await prisma.service.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error: any) {
    console.error("Service update error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}
