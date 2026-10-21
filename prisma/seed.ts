import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Kenala Health Hub database...");

  // 1. Seed Clinic Settings
  await prisma.clinicSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      clinicName: "Kenala Health Hub",
      practitionerName: "Sr Grace",
      phone: "079 011 8464",
      whatsappNumber: "079 011 8464",
      address: "Corner Love drive & Alwyn str, ext 4, Nellmapius",
      operatingHours: "Monday – Saturday: 08:00 – 17:00 | Sunday & Public Holidays: By appointment",
      defaultRetainerPercent: 30.0,
      adminAlertEmail: "info@kenalahealthhub.co.za",
    },
  });

  // 2. Seed Default Admin User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("Kenala2026!", salt);

  await prisma.admin.upsert({
    where: { email: "admin@kenalahealthhub.co.za" },
    update: { passwordHash },
    create: {
      email: "admin@kenalahealthhub.co.za",
      name: "Sr Grace",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  // 3. Seed Clinical Services from the Flyer & Catalog
  const services = [
    {
      name: "Baby & Adult Immunisation",
      slug: "baby-adult-immunisation",
      category: "Immunisation & Wellness",
      shortDescription: "Routine childhood vaccines, travel immunisations, flu shots, and booster injections administered in a sterile, gentle environment.",
      fullDescription: "Safe and caring vaccine administration for infants, children, and adults. Following South African EPI schedule guidelines, we provide childhood immunization, travel vaccines, tetanus boosters, measles, and seasonal flu vaccines with detailed post-vaccine observation.",
      price: 450.0,
      retainerPercentage: 30.0,
      durationMinutes: 30,
      icon: "syringe",
      prepInstructions: "Please bring the child's Road to Health Chart (clinic card) and any previous immunisation records.",
      displayOrder: 1,
    },
    {
      name: "Family Planning",
      slug: "family-planning",
      category: "Reproductive Health",
      shortDescription: "Contraceptive consultations, injections (Depo-Provera/Nur-Isterate), oral contraceptives, and fertility guidance.",
      fullDescription: "Confidential reproductive healthcare and tailored contraceptive solutions. We provide professional advice on hormonal and barrier methods, contraceptive injections, oral pills, emergency contraception, and family planning counseling suited to your personal health needs.",
      price: 380.0,
      retainerPercentage: 30.0,
      durationMinutes: 30,
      icon: "users",
      prepInstructions: "No special preparation needed. Please have information ready regarding your last menstrual cycle.",
      displayOrder: 2,
    },
    {
      name: "Antenatal Care (Pregnant Women)",
      slug: "antenatal-care",
      category: "Maternity & Motherhood",
      shortDescription: "Compassionate antenatal monitoring, blood pressure checks, foetal heart monitoring, and pregnancy support.",
      fullDescription: "Dedicated clinical support throughout your pregnancy. Includes maternal blood pressure & urine dipstick screening, fundal height measurement, foetal Doppler heartbeat monitoring, nutritional counseling, and birth preparation guidance led by experienced midwife Sr Grace.",
      price: 600.0,
      retainerPercentage: 30.0,
      durationMinutes: 45,
      icon: "baby",
      prepInstructions: "Bring your maternity case record and recent ultrasound scans if available. Stay well hydrated before your visit.",
      displayOrder: 3,
    },
    {
      name: "Occupational Health Medicals",
      slug: "occupational-health-medicals",
      category: "Corporate & Workplace",
      shortDescription: "Pre-employment, periodic, and exit medical fitness examinations for workers across all industries.",
      fullDescription: "Compliant occupational medical examinations meeting South African OHS Act requirements. We offer physical fitness screenings, vital signs analysis, vision screening, lung function reviews, and certified fitness-to-work documentation.",
      price: 750.0,
      retainerPercentage: 30.0,
      durationMinutes: 45,
      icon: "briefcase",
      prepInstructions: "Please bring your official ID document/passport, company job specification (if any), and wear comfortable clothing.",
      displayOrder: 4,
    },
    {
      name: "Pap Smears & Cervical Screening",
      slug: "pap-smears",
      category: "Women's Health",
      shortDescription: "Gentle cervical cancer screening and laboratory pathology sampling conducted with utmost privacy and dignity.",
      fullDescription: "Essential preventative cervical health examination for women. Administered with care, dignity, and high hygiene standards. Samples are dispatched to accredited laboratories for thorough cytological evaluation.",
      price: 550.0,
      retainerPercentage: 30.0,
      durationMinutes: 30,
      icon: "shield-check",
      prepInstructions: "Schedule your appointment at least 5 days after your menstrual period has ended. Avoid intercourse or vaginal products 48 hours prior.",
      displayOrder: 5,
    },
    {
      name: "Blood Tests & Phlebotomy",
      slug: "blood-tests",
      category: "Diagnostic & Lab",
      shortDescription: "Professional blood sample collection for routine health checks, glucose, cholesterol, full blood count, and organ function.",
      fullDescription: "Accurate and gentle phlebotomy blood draw performed by a registered nurse. We collect samples for routine wellness panels, diabetic monitoring (HbA1c), cholesterol lipids, thyroid function, liver/kidney profiles, and specific doctor-requested pathology.",
      price: 350.0,
      retainerPercentage: 30.0,
      durationMinutes: 20,
      icon: "droplet",
      prepInstructions: "If your test requires fasting (glucose, lipid profile), please fast for 8-10 hours prior. Drinking plain water is recommended.",
      displayOrder: 6,
    },
    {
      name: "Minor Ailments & General Healthcare",
      slug: "minor-ailments-general-healthcare",
      category: "Primary Care",
      shortDescription: "Primary clinical diagnosis and treatment for acute illnesses, colds, flu, skin infections, sprains, and general prescriptions.",
      fullDescription: "Immediate clinical attention for everyday medical conditions. We evaluate and treat respiratory infections, mild asthma exacerbations, gastrointestinal upsets, urinary tract infections, skin rashes, minor burns, and issue registered nurse clinical prescriptions.",
      price: 400.0,
      retainerPercentage: 30.0,
      durationMinutes: 30,
      icon: "stethoscope",
      prepInstructions: "Bring a list of any current medications or chronic treatments you are presently taking.",
      displayOrder: 7,
    },
    {
      name: "IV Drip Infusion Therapy",
      slug: "iv-drip-infusion-therapy",
      category: "Wellness & Recovery",
      shortDescription: "Immune boosters, rehydration infusions, iron restoration, and energy infusions administered safely.",
      fullDescription: "Medical-grade intravenous nutrient and hydration therapy. Formulated to rapidly replenish micronutrients, accelerate recovery from exhaustion or illness, support immune resilience, and treat clinical deficiencies with high bioavailability.",
      price: 850.0,
      retainerPercentage: 30.0,
      durationMinutes: 60,
      icon: "activity",
      prepInstructions: "Have a light snack and drink water 30 minutes prior to your infusion session.",
      displayOrder: 8,
    },
    {
      name: "Wound Care & Sterile Dressing",
      slug: "wound-care-dressing",
      category: "Surgical & Recovery",
      shortDescription: "Post-operative surgical wound monitoring, suture/staple removal, burn care, and chronic ulcer management.",
      fullDescription: "Professional wound healing management following strict aseptic technique. We assess wound beds, change sterile dressings, provide advanced wound care for pressure sores or diabetic ulcers, and safely remove surgical sutures or staples.",
      price: 500.0,
      retainerPercentage: 30.0,
      durationMinutes: 40,
      icon: "heart-pulse",
      prepInstructions: "Keep existing dressings intact until your appointment unless otherwise instructed.",
      displayOrder: 9,
    },
    {
      name: "Postnatal & Newborn Care",
      slug: "postnatal-newborn-care",
      category: "Maternity & Motherhood",
      shortDescription: "Mother recovery checks, infant growth monitoring, jaundice review, umbilical cord care, and lactation guidance.",
      fullDescription: "Holistic care for new mothers and their newborns. Includes maternal physical recovery checks, blood pressure monitoring, newborn weight checks, feeding assessment, umbilical care, and guidance on early postpartum wellness.",
      price: 650.0,
      retainerPercentage: 30.0,
      durationMinutes: 45,
      icon: "heart",
      prepInstructions: "Have the baby's clinic card and feeding log accessible during the session.",
      displayOrder: 10,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  console.log(`✅ Seeded ${services.length} clinical services successfully.`);
  console.log("✅ Admin account created: admin@kenalahealthhub.co.za / Kenala2026!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
