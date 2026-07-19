/**
 * UGAMA AARAMBHA — Event Constants
 * Single source of truth for all event-related content.
 * Edit here; every component reads from this file.
 */

// ─── Event Metadata ───────────────────────────────────────────────────────────

export const EVENT = {
  title: "UGAMA AARAMBHA 2K26",
  tagline: "A New Chapter Begins",
  fullTitle: "Joint Installation Ceremony",
  edition: "Joint Installation Ceremony",
  rotaryYear: "2026–27",
  date: "Sunday, 12th July 2026",
  dateISO: "2026-07-12",
  time: "6:00 PM",
  venue: "Rotary House of Friendship [RHF]",
  venueShort: "Rotary House of Friendship [RHF]",
  googleMapsUrl: "https://www.google.com/maps/dir//Rotary+Club+of+Bangalore,+Rotary+House+of+Friendship,+20,+Lavelle+Road,+Shanthala+Nagar,+Ashok+Nagar,+Bengaluru,+Karnataka+560001/@13.0690332,77.5963265,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bae16a6376ec16f:0xaac96b4924304d4f!2m2!1d77.5993303!2d12.9743853?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D",
  dressCode: "Ethnic",
  district: "District 3192",
  isClosed: true,
  mainWebsiteUrl: "https://rotaractswarnabengaluru.in",
} as const;

// ─── Host Clubs ───────────────────────────────────────────────────────────────

export const HOST_CLUBS = [
  "Rotaract Club of Swarna Bengaluru",
  "Rotaract Club of Bengaluru Nava Chaitanya",
] as const;

export const PRIMARY_CLUB = HOST_CLUBS[0];

// ─── Event Details Cards ──────────────────────────────────────────────────────

export const EVENT_DETAILS = [
  { label: "Date",       value: EVENT.date,      icon: "📅" },
  { label: "Time",       value: EVENT.time,       icon: "🕕" },
  { label: "Venue",      value: EVENT.venue,      icon: "📍" },
  { label: "Dress Code", value: EVENT.dressCode,  icon: "🥻" },
] as const;

// ─── Special Guests ───────────────────────────────────────────────────────────

export const GUESTS = [
  {
    role: "President of Rotary Club of Bangalore",
    name: "Rtn. Vineetha Chinappa",
    note: null,
  },
  {
    role: "District Rotaract Committee Chair",
    name: "PDRR PHF Rtn. Naveen P Senna",
    note: "RI District 3192",
  },
  {
    role: "Guest of Honor",
    name: "Rtn. Anju Agadi",
    note: "Youth Service Director \nRotary Club of Bangalore",
  },
  {
    role: "Guest of Honor / Club Advisor",
    name: "Rtn. Meera Bai Shankar",
    note: "Club Advisor \nRotaract Club of Swarna Bengaluru",
  },
] as const;

export const INDUCTION = {
  label: "Induction Ceremony",
  description: "New members shall be inducted by\nDistrict Rotaract Representative | RI District 3192",
  inductorName: "PHF. Rtr.Rtn. Sanjay R",
} as const;

// ─── Leadership ───────────────────────────────────────────────────────────────

export const LEADERSHIP = {
  swarnaBengaluru: {
    clubName: "Rotaract Club of Swarna Bengaluru",
    outgoingPresident: {
      role: "President 2025-26",
      name: "Rtr. Dr.Harish",
    },
    incomingPresident: {
      role: "President 2026-27",
      name: "Rtr. Vigneshwaran",
    },
    outgoingSecretary: {
      role: "Secretary 2025-26",
      name: "Rtr. Rashmitha & Rtr. Vigneshwaran",
    },
    incomingSecretary: {
      role: "Secretary 2026-27",
      name: "Rtr. Ganesh & Rtr. Prerana",
    },
  },
  navaChaitanya: {
    clubName: "Rotaract Club of Bengaluru Nava Chaitanya",
    outgoingPresident: {
      role: "President 2025-26",
      name: "Rtr. Srivatsa",
    },
    incomingPresident: {
      role: "President 2026-27",
      name: "Rtr. Srivatsa",
    },
    outgoingSecretary: {
      role: "Secretary 2025-26",
      name: "Rtr. Disha & Rtr. Danish",
    },
    incomingSecretary: {
      role: "Secretary 2026-27",
      name: "Rtr. Nayana",
    },
  },
} as const;

// ─── RSVP Contacts ────────────────────────────────────────────────────────────

export const RSVP_CONTACTS = [
  {
    name: "Rtr. Ganesh & Rtr. Prerana",
    role: "Secretary 2026-27",
    phone: "+91 97426 31254",
  },
  {
    name: "Rtr. Vigneshwaran",
    role: "President 2026-27",
    phone: "+91 80956 71203",
  },
] as const;

// ─── SEO / Meta ───────────────────────────────────────────────────────────────

export const META = {
  title: `UGAMA AARAMBHA 2K26 | Joint Installation Ceremony`,
  description:
    "A New Chapter Begins. Join us as we celebrate the joint installation of Swarna Bengaluru and Bengaluru Nava Chaitanya presidents & office bearers.",
  url: "https://invite.rcsb.org", // update to your actual domain
  ogImage: "/poster.jpg",          // fall back to the event poster in /public
  keywords: [
    "UGAMA AARAMBHA 2K26",
    "Joint Installation Ceremony",
    "Rotaract Club of Swarna Bengaluru",
    "Rotaract Club of Bengaluru Nava Chaitanya",
    "Rotary District 3192",
    "Rotaract District 3192",
    "Rotary House of Friendship",
    "RHF Bangalore",
    "RCSB",
    "Swarna Bengaluru",
    "Nava Chaitanya",
    "eInvite",
    "RSVP Swarna Bengaluru",
    "Rotary Club of Bangalore",
    "Bengaluru Rotaract Installation"
  ],
} as const;

// ─── Email ────────────────────────────────────────────────────────────────────

export const EMAIL_CONFIG = {
  senderName: "UGAMA AARAMBHA 2K26",
  senderAddress: process.env.NODEMAILER_FROM ?? "noreply@example.com",
  replyTo: "rota.rcsb@gmail.com",
} as const;

export const EVENT_FLOW = [
  { time: "05:30 PM - 06:00 PM", activity: "Registration & Networking" },
  { time: "06:00 PM - 06:02 PM", activity: "Opening Remarks" },
  { time: "06:02 PM - 06:03 PM", activity: "Collaring of Outgoing Presidents (Rtr. Harish & Rtr. Srivatsa)" },
  { time: "06:03 PM - 06:04 PM", activity: "Silent Prayer" },
  { time: "06:04 PM - 06:05 PM", activity: "Rotary Four-Way Test" },
  { time: "06:05 PM - 06:10 PM", activity: "Calling the Dignitaries on Stage & Lighting the Lamp" },
  { time: "06:10 PM - 06:15 PM", activity: "Welcome Address by Outgoing President (Rtr. Dr. Harish)" },
  { time: "06:15 PM - 06:20 PM", activity: "Glimpse of the Year Gone By – Swarna Bengaluru (Rtr. Rashmitha)" },
  { time: "06:20 PM - 06:25 PM", activity: "Glimpse of the Year Gone By – Bengaluru Nava Chaitanya (Rtr. Disha)" },
  { time: "06:25 PM - 06:30 PM", activity: "Introduction of Incoming President – Swarna Bengaluru (Rtr. Sagar)" },
  { time: "06:30 PM - 06:35 PM", activity: "Introduction of Incoming President – Bengaluru Nava Chaitanya (Rtr. Srikara)" },
  { time: "06:35 PM - 06:37 PM", activity: "Installation of President & Handover of the Gavel – Swarna Bengaluru" },
  { time: "06:38 PM - 06:41 PM", activity: "Acceptance Speech – Swarna Bengaluru (Rtr. Vigneshwaran)" },
  { time: "06:42 PM - 06:45 PM", activity: "Acceptance Speech – Bengaluru Nava Chaitanya (Rtr. Srivatsa)" },
  { time: "06:46 PM - 06:55 PM", activity: "Installation of Board of Directors – Swarna Bengaluru" },
  { time: "06:56 PM - 07:05 PM", activity: "Installation of Board of Directors – Bengaluru Nava Chaitanya" },
  { time: "07:06 PM - 07:16 PM", activity: "Induction of New Members – Swarna Bengaluru" },
  { time: "07:17 PM - 07:27 PM", activity: "Induction of New Members – Bengaluru Nava Chaitanya" },
  { time: "07:28 PM - 07:33 PM", activity: "Launch of Website and Letterhead – Swarna Bengaluru" },
  { time: "07:34 PM - 07:38 PM", activity: "Launch of Website and Letterhead – Bengaluru Nava Chaitanya" },
  { time: "07:39 PM - 07:45 PM", activity: "Release of Merit Scholarship Cheque to Students (Rtn. Meera Bai Shankar)" },
  { time: "07:46 PM - 07:47 PM", activity: "Introduction of DRR Rtr. Rtn. Sanjay R." },
  { time: "07:48 PM - 07:51 PM", activity: "Address by DRR (DRR Rtr. Rtn. Sanjay R.)" },
  { time: "07:52 PM - 07:53 PM", activity: "Introduction of Rotary YSD" },
  { time: "07:54 PM - 07:57 PM", activity: "Address by YSD (Rtn. Dr. Anju Agadi)" },
  { time: "07:58 PM - 07:59 PM", activity: "Introduction of District Rotaract Committee Chair" },
  { time: "08:00 PM - 08:03 PM", activity: "Address by DRCC (PDRR PHF Rtn. Naveen P Senna)" },
  { time: "08:03 PM - 08:04 PM", activity: "Introduction of Club Advisor and Trainer" },
  { time: "08:05 PM - 08:10 PM", activity: "Address by Club Advisor and Trainer (Rtn. Meera Bai)" },
  { time: "08:11 PM - 08:12 PM", activity: "Introduction of Rotary President" },
  { time: "08:13 PM - 08:16 PM", activity: "Address by Rotary President (Rtn. Vineetha Chinappa)" },
  { time: "08:17 PM - 08:21 PM", activity: "Floor Open for Announcements" },
  { time: "08:21 PM - 08:24 PM", activity: "Secretarial Announcements" },
  { time: "08:25 PM - 08:27 PM", activity: "Vote of Thanks (Rtr. Prerana & Rtr. Nayana)" },
  { time: "08:27 PM onwards", activity: "National Anthem, Fellowship & Dinner" }
] as const;
