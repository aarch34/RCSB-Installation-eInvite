import nodemailer from "nodemailer";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { EVENT, PRIMARY_CLUB, EVENT_FLOW } from "@/lib/constants";

// ─── Transporter (lazy singleton) ────────────────────────────────────────────

let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (_transporter) return _transporter;

  const host = process.env.NODEMAILER_HOST;
  const port = parseInt(process.env.NODEMAILER_PORT ?? "587", 10);
  const user = process.env.NODEMAILER_USER;
  const pass = process.env.NODEMAILER_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "Nodemailer env vars missing. Add NODEMAILER_HOST, NODEMAILER_PORT, NODEMAILER_USER, NODEMAILER_PASS to .env.local"
    );
  }

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465 (SSL), false for 587 (TLS/STARTTLS)
    auth: { user, pass },
  });

  return _transporter;
}

// ─── Email Template Styles (Shared) ──────────────────────────────────────────

const emailStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500&display=swap');
  body { margin: 0; padding: 0; background-color: #1a1210; color: #F5EFC8; font-family: 'Inter', sans-serif; }
  .wrapper { max-width: 600px; margin: 0 auto; background-color: #231815; }
  .header { padding: 48px 40px 32px; text-align: center; border-bottom: 1px solid rgba(245,239,200,0.08); }
  .header-micro { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(165,188,214,0.6); margin: 0 0 16px; font-weight: 300; }
  .header-title { font-family: 'Playfair Display', Georgia, serif; font-size: 38px; font-style: italic; color: #F5EFC8; margin: 0; font-weight: 400; }
  .body { padding: 36px 40px; }
  .greeting { font-size: 14px; color: rgba(165,188,214,0.9); font-weight: 300; line-height: 1.7; margin: 0 0 28px; }
  .pass { border: 1px solid rgba(245,239,200,0.15); border-radius: 16px; overflow: hidden; background: rgba(35,24,21,0.6); }
  .pass-top { padding: 24px 28px; }
  .pass-label { font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(165,188,214,0.5); margin: 0 0 6px; }
  .pass-name { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-style: italic; color: #F5EFC8; margin: 0; }
  .pass-sub { font-size: 12px; color: rgba(165,188,214,0.7); margin: 4px 0 0; font-weight: 300; }
  .pass-divider { border: none; border-top: 1px dashed rgba(245,239,200,0.12); margin: 0; }
  .pass-grid { padding: 20px 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .pass-cell-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(165,188,214,0.45); margin: 0 0 3px; }
  .pass-cell-value { font-size: 12px; color: rgba(255,255,255,0.82); margin: 0; font-weight: 300; }
  .pass-cell-value.status { color: #F5EFC8; }
  .pass-ref { padding: 16px 28px 24px; border-top: 1px dashed rgba(245,239,200,0.12); display: flex; justify-content: space-between; align-items: flex-end; }
  .ref-number { font-family: 'Courier New', monospace; font-size: 22px; letter-spacing: 0.18em; color: #F5EFC8; }
  .ref-host { font-size: 10px; color: rgba(255,255,255,0.4); text-align: right; line-height: 1.5; font-weight: 300; max-width: 120px; }
  .footer { padding: 28px 40px 40px; text-align: center; }
  .footer-text { font-size: 11px; color: rgba(165,188,214,0.4); font-weight: 300; letter-spacing: 0.12em; line-height: 1.8; margin: 0; }
  .divider-line { width: 48px; height: 1px; background: rgba(245,239,200,0.15); margin: 20px auto; }
  @media (max-width: 480px) {
    .header { padding: 36px 24px 24px; }
    .body { padding: 28px 24px; }
    .pass-grid { grid-template-columns: 1fr; }
    .pass-top, .pass-ref { padding-left: 20px; padding-right: 20px; }
  }
`;

// ─── RSVP Confirmation HTML Template ──────────────────────────────────────────

function buildConfirmationHtml(params: {
  fullName: string;
  clubName: string;
  designation?: string;
  reference: string;
}): string {
  const { fullName, clubName, designation, reference } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RSVP Confirmed — UGAMA AARAMBHA</title>
  <style>
    ${emailStyles}
  </style>
</head>
<body>
  <div class="wrapper">

    <div class="header">
      <div style="text-align: center; margin-bottom: 16px;">
        <img src="cid:ganesha-logo" width="60" style="object-fit: contain; opacity: 0.85;" alt="Ganesha Logo" />
      </div>
      <p class="header-micro">${PRIMARY_CLUB} · ${EVENT.district}</p>
      <h1 class="header-title">${EVENT.title}</h1>
    </div>

    <div class="body">
      <p class="greeting">
        Dear <strong style="color:#F5EFC8; font-weight:400;">${fullName}</strong>,<br /><br />
        Your RSVP for <em>${EVENT.fullTitle}</em> has been confirmed. We are delighted to have you with us for this special evening.
      </p>

      <div class="pass">
        <div class="pass-top">
          <p class="pass-label">Invitation Reserved</p>
          <p class="pass-name">${fullName}</p>
          ${designation ? `<p class="pass-sub">${designation}</p>` : ""}
          <p class="pass-sub" style="margin-top:${designation ? "2px" : "4px"}">${clubName}</p>
        </div>

        <hr class="pass-divider" />

        <div class="pass-grid">
          <div>
            <p class="pass-cell-label">Event</p>
            <p class="pass-cell-value">${EVENT.title}</p>
          </div>
          <div>
            <p class="pass-cell-label">Date</p>
            <p class="pass-cell-value">${EVENT.date}</p>
          </div>
          <div>
            <p class="pass-cell-label">Venue</p>
            <p class="pass-cell-value">
              <a href="${EVENT.googleMapsUrl}" target="_blank" style="color: #ffffff; text-decoration: underline; font-weight: 300;">
                ${EVENT.venue}
              </a>
            </p>
          </div>
          <div>
            <p class="pass-cell-label">Status</p>
            <p class="pass-cell-value status">CONFIRMED ✓</p>
          </div>
        </div>

        <!-- Check-in QR Code Section -->
        <div style="text-align: center; padding: 28px; background: rgba(255,255,255,0.015); border-top: 1px dashed rgba(245,239,200,0.12);">
          <p class="pass-cell-label" style="margin-bottom: 12px; letter-spacing: 0.25em;">Check-in QR Code</p>
          <img src="cid:rsvp-qrcode" width="170" height="170" style="border: 3px solid #F5EFC8; border-radius: 12px; background: #FFFFFF; padding: 8px;" alt="Check-in QR Code" />
          <p style="font-size: 10px; color: rgba(165,188,214,0.5); margin: 12px 0 0; font-weight: 300; letter-spacing: 0.05em; line-height: 1.4;">
            Please present this QR code at the registration desk<br />upon arrival for automated check-in.
          </p>
          <div style="margin-top: 20px;">
            <a href="${EVENT.googleMapsUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; background-color: #F5EFC8; color: #1a1210; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; text-decoration: none; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 24px; box-shadow: 0 4px 12px rgba(245,239,200,0.15);">
              📍 Open Venue Location
            </a>
          </div>
        </div>

        <div class="pass-ref">
          <div>
            <p class="pass-cell-label">Reference</p>
            <p class="ref-number">${reference}</p>
          </div>
          <p class="ref-host">${PRIMARY_CLUB}</p>
        </div>
      </div>

      <div class="divider-line"></div>

      <p class="greeting" style="text-align:center; margin:0;">
        We look forward to welcoming you.<br />
        <em style="color:#F5EFC8;">See you on the 12th.</em>
      </p>
    </div>

    <div class="footer">
      <p class="footer-text">
        ${EVENT.fullTitle} · ${EVENT.edition}<br />
        ${EVENT.date} · ${EVENT.time}<br />
        <a href="${EVENT.googleMapsUrl}" target="_blank" style="color: rgba(165,188,214,0.4); text-decoration: underline;">
          ${EVENT.venue}
        </a>
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

// ─── Welcome Event Flow HTML Template ──────────────────────────────────────────

function buildWelcomeEventHtml(params: { fullName: string }): string {
  const { fullName } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to UGAMA AARAMBHA</title>
  <style>
    ${emailStyles}
    .flow-card { border: 1px solid rgba(165,188,214,0.15); border-radius: 16px; overflow: hidden; background: rgba(35,24,21,0.4); margin-top: 24px; padding: 28px 24px; }
    .flow-header { text-align: center; margin-bottom: 24px; border-bottom: 1px solid rgba(245,239,200,0.08); padding-bottom: 16px; }
    .flow-title { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #A5BCD6; font-weight: 400; margin: 0 0 4px; }
    .flow-subtitle { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-style: italic; color: #F5EFC8; margin: 0; font-weight: 400; }
    .roadmap-section { border-left: 2px solid #F5EFC8; margin: 24px 0; padding-left: 20px; text-align: left; }
    .roadmap-section.after { border-left: 2px solid #A5BCD6; }
    .roadmap-time { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(165,188,214,0.6); margin-bottom: 4px; }
    .roadmap-heading { font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-style: italic; color: #F5EFC8; margin: 0 0 10px; font-weight: 400; }
    .roadmap-heading.after { color: #A5BCD6; }
    .roadmap-list { margin: 0; padding-left: 16px; font-size: 12.5px; color: rgba(255,255,255,0.85); line-height: 1.6; font-weight: 300; }
    .roadmap-list li { margin-bottom: 4px; }
    .roadmap-subtext { font-size: 11px; font-style: italic; color: rgba(165,188,214,0.6); margin: 6px 0 0; font-weight: 300; padding-left: 16px; }
    .flowchart { background: rgba(245, 239, 200, 0.02); border: 1px solid rgba(245, 239, 200, 0.08); border-radius: 12px; padding: 24px; font-family: monospace; font-size: 11px; color: #F5EFC8; text-align: center; line-height: 1.5; margin: 32px 0 12px; letter-spacing: 0.02em; }
    .flowchart-title { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(165,188,214,0.5); margin: 0 0 16px; font-family: 'Inter', Helvetica, sans-serif; }
  </style>
</head>
<body>
  <div class="wrapper">

    <div class="header">
      <div style="text-align: center; margin-bottom: 16px;">
        <img src="cid:ganesha-logo" width="60" style="object-fit: contain; opacity: 0.85;" alt="Ganesha Logo" />
      </div>
      <p class="header-micro">Welcome to</p>
      <h1 class="header-title">${EVENT.title}</h1>
    </div>

    <div class="body">
      <p class="greeting" style="font-size: 15px;">
        Welcome, <strong style="color:#F5EFC8; font-weight:500;">${fullName}</strong>!
      </p>

      <p class="greeting">
        We are thrilled to welcome you to the <strong>${EVENT.fullTitle}</strong>. Your check-in has been completed successfully. 
        <br /><br />
        For your convenience, here is the official event schedule for this evening. We hope you have an inspiring and wonderful evening with us.
      </p>

      <div class="flow-card">
        <div class="flow-header">
          <p class="flow-title">Audience Event Roadmap</p>
          <h3 class="flow-subtitle">Schedule of the Evening</h3>
        </div>

        <!-- 1. Arrival & Registration -->
        <div class="roadmap-section">
          <div class="roadmap-time">🕠 5:30 PM – 6:00 PM</div>
          <h4 class="roadmap-heading">Arrival & Registration</h4>
          <ul class="roadmap-list">
            <li>Guests arrive at the venue.</li>
            <li>Registration and networking with fellow Rotaractors, Rotarians, and invitees.</li>
            <li>Photo opportunities and seating.</li>
          </ul>
        </div>

        <!-- 2. Inaugural Ceremony -->
        <div class="roadmap-section">
          <div class="roadmap-time">🌟 6:00 PM – 6:15 PM</div>
          <h4 class="roadmap-heading">Inaugural Ceremony</h4>
          <ul class="roadmap-list" style="list-style-type: none; padding-left: 0;">
            <li style="margin-bottom: 6px;"><strong style="color: #F5EFC8; font-weight: 400; font-family: monospace;">6:00 PM</strong> &bull; Opening Remarks</li>
            <li style="margin-bottom: 6px;"><strong style="color: #F5EFC8; font-weight: 400; font-family: monospace;">6:02 PM</strong> &bull; Collaring of the Outgoing Presidents</li>
            <li style="margin-bottom: 6px;"><strong style="color: #F5EFC8; font-weight: 400; font-family: monospace;">6:03 PM</strong> &bull; Silent Prayer</li>
            <li style="margin-bottom: 6px;"><strong style="color: #F5EFC8; font-weight: 400; font-family: monospace;">6:04 PM</strong> &bull; Rotary Four-Way Test</li>
            <li style="margin-bottom: 6px;"><strong style="color: #F5EFC8; font-weight: 400; font-family: monospace;">6:05 PM</strong> &bull; Welcome of Dignitaries & Ceremonial Lamp Lighting</li>
            <li style="margin-bottom: 6px;"><strong style="color: #F5EFC8; font-weight: 400; font-family: monospace;">6:10 PM</strong> &bull; Welcome Address by the Outgoing President</li>
          </ul>
        </div>

        <!-- 3. Celebrating the Journey -->
        <div class="roadmap-section">
          <div class="roadmap-time">🎬 6:15 PM – 6:25 PM</div>
          <h4 class="roadmap-heading">Celebrating the Journey</h4>
          <ul class="roadmap-list">
            <li>Glimpse of the Rotary Year Gone By – Rotaract Club of Swarna Bengaluru</li>
            <li>Glimpse of the Rotary Year Gone By – Rotaract Club of Bengaluru Nava Chaitanya</li>
          </ul>
        </div>

        <!-- 4. Presidential Installation -->
        <div class="roadmap-section">
          <div class="roadmap-time">👑 6:25 PM – 6:45 PM</div>
          <h4 class="roadmap-heading">Presidential Installation Ceremony</h4>
          <ul class="roadmap-list">
            <li>Introduction of Incoming Presidents</li>
            <li>Official Installation of the Presidents</li>
            <li>Handover of the Gavel</li>
            <li>Acceptance Speeches by the Incoming Presidents</li>
          </ul>
        </div>

        <!-- 5. Board Installation -->
        <div class="roadmap-section">
          <div class="roadmap-time">🤝 6:46 PM – 7:05 PM</div>
          <h4 class="roadmap-heading">Installation of the New Leadership</h4>
          <ul class="roadmap-list">
            <li>Installation of the Board of Directors:
              <ul style="margin: 4px 0 0; padding-left: 16px; list-style-type: circle;">
                <li style="margin-bottom: 2px;">Rotaract Club of Swarna Bengaluru</li>
                <li style="margin-bottom: 2px;">Rotaract Club of Bengaluru Nava Chaitanya</li>
              </ul>
            </li>
          </ul>
        </div>

        <!-- 6. Induction Ceremony -->
        <div class="roadmap-section">
          <div class="roadmap-time">🎉 7:06 PM – 7:27 PM</div>
          <h4 class="roadmap-heading">Induction Ceremony</h4>
          <ul class="roadmap-list">
            <li>Induction of New Members (Swarna Bengaluru & Bengaluru Nava Chaitanya)</li>
          </ul>
          <p class="roadmap-subtext">Welcome the newest members into the Rotaract family.</p>
        </div>

        <!-- 7. Launches -->
        <div class="roadmap-section">
          <div class="roadmap-time">🚀 7:28 PM – 7:38 PM</div>
          <h4 class="roadmap-heading">Club Launches</h4>
          <p style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 0 0 8px; font-weight: 300; padding-left: 16px;">Witness the unveiling of:</p>
          <ul class="roadmap-list">
            <li>Official Club Website</li>
            <li>Official Club Letterhead</li>
          </ul>
          <p class="roadmap-subtext">for both clubs.</p>
        </div>

        <!-- 8. Scholarship -->
        <div class="roadmap-section">
          <div class="roadmap-time">🎓 7:39 PM – 7:45 PM</div>
          <h4 class="roadmap-heading">Merit Scholarship Presentation</h4>
          <ul class="roadmap-list">
            <li>Presentation of scholarship cheques to deserving students under the <strong>Rtn. Meera Bai Shankar Merit Scholarship</strong>.</li>
          </ul>
        </div>

        <!-- 9. Addresses -->
        <div class="roadmap-section">
          <div class="roadmap-time">🎤 7:46 PM – 8:16 PM</div>
          <h4 class="roadmap-heading">Addresses by Distinguished Guests</h4>
          <p style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 0 0 8px; font-weight: 300; padding-left: 16px;">Inspirational messages from:</p>
          <ul class="roadmap-list">
            <li>District Rotaract Representative (DRR)</li>
            <li>Rotary Youth Service Director (YSD)</li>
            <li>District Rotaract Committee Chair (DRCC)</li>
            <li>Club Advisor & Trainer</li>
            <li>Rotary Club President</li>
          </ul>
        </div>

        <!-- 10. Announcements -->
        <div class="roadmap-section">
          <div class="roadmap-time">📢 8:17 PM – 8:24 PM</div>
          <h4 class="roadmap-heading">Club Announcements</h4>
          <ul class="roadmap-list">
            <li>Important announcements from the dignitaries</li>
            <li>Secretary's announcements</li>
            <li>Upcoming projects and club updates</li>
          </ul>
        </div>

        <!-- 11. Closing -->
        <div class="roadmap-section">
          <div class="roadmap-time">🙏 8:25 PM – 8:27 PM</div>
          <h4 class="roadmap-heading">Closing Ceremony</h4>
          <ul class="roadmap-list">
            <li>Vote of Thanks</li>
            <li>Official conclusion of the Installation Ceremony</li>
          </ul>
        </div>

        <!-- 12. After -->
        <div class="roadmap-section after">
          <div class="roadmap-time">📸 After the Ceremony</div>
          <h4 class="roadmap-heading after">Fellowship & Networking</h4>
          <ul class="roadmap-list">
            <li>Group photographs</li>
            <li>Networking with guests and dignitaries</li>
            <li>Fellowship & Dinner</li>
          </ul>
        </div>

        <!-- Flowchart diagram -->
        <div class="flowchart">
          <div class="flowchart-title">Event Flow at a Glance</div>
          Registration<br />
          <span style="color: rgba(245,239,200,0.35);">↓</span><br />
          Opening Ceremony<br />
          <span style="color: rgba(245,239,200,0.35);">↓</span><br />
          Year in Review<br />
          <span style="color: rgba(245,239,200,0.35);">↓</span><br />
          President Installation<br />
          <span style="color: rgba(245,239,200,0.35);">↓</span><br />
          Board Installation<br />
          <span style="color: rgba(245,239,200,0.35);">↓</span><br />
          Member Induction<br />
          <span style="color: rgba(245,239,200,0.35);">↓</span><br />
          Website & Letterhead Launch<br />
          <span style="color: rgba(245,239,200,0.35);">↓</span><br />
          Scholarship Presentation<br />
          <span style="color: rgba(245,239,200,0.35);">↓</span><br />
          Guest Addresses<br />
          <span style="color: rgba(245,239,200,0.35);">↓</span><br />
          Announcements<br />
          <span style="color: rgba(245,239,200,0.35);">↓</span><br />
          Vote of Thanks<br />
          <span style="color: rgba(245,239,200,0.35);">↓</span><br />
          Photos • Networking • Dinner
        </div>
        
        <div style="text-align: center; margin: 24px 0 8px;">
          <a href="${EVENT.googleMapsUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; background-color: #F5EFC8; color: #1a1210; font-family: 'Inter', Helvetica, sans-serif; font-size: 11px; font-weight: 600; text-decoration: none; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 24px; box-shadow: 0 4px 12px rgba(245,239,200,0.15);">
            📍 Navigate to Venue
          </a>
        </div>
      </div>

      <div class="divider-line"></div>

      <p class="greeting" style="text-align:center; margin:0;">
        Thank you for joining us in celebrating this new beginning.<br />
        <em style="color:#F5EFC8;">Enjoy the installation ceremony.</em>
      </p>
    </div>

    <div class="footer">
      <p class="footer-text">
        ${PRIMARY_CLUB} · ${EVENT.district}<br />
        <a href="${EVENT.googleMapsUrl}" target="_blank" style="color: rgba(165,188,214,0.4); text-decoration: underline;">
          ${EVENT.venue}
        </a>
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

// ─── Send Confirmation Email (With QR Code) ──────────────────────────────────

export async function sendConfirmationEmail(params: {
  toEmail: string;
  fullName: string;
  clubName: string;
  designation?: string;
  reference: string;
}): Promise<void> {
  const { toEmail, fullName, clubName, designation, reference } = params;

  const from = `${process.env.NODEMAILER_FROM_NAME ?? "UGAMA AARAMBHA"} <${
    process.env.NODEMAILER_FROM ?? process.env.NODEMAILER_USER
  }>`;

  // 1. Generate QR Code Buffer
  const qrBuffer = await QRCode.toBuffer(reference, {
    margin: 1,
    width: 320,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  const html = buildConfirmationHtml({ fullName, clubName, designation, reference });

  // 2. Send email with inline image attachment
  await getTransporter().sendMail({
    from,
    to: toEmail,
    replyTo: process.env.NODEMAILER_REPLY_TO ?? from,
    subject: `Your RSVP is Confirmed — ${EVENT.title} · ${EVENT.date}`,
    html,
    text: [
      `Dear ${fullName},`,
      "",
      `Your RSVP for the ${EVENT.fullTitle} (${EVENT.title}) is confirmed.`,
      "",
      `Event: ${EVENT.title}`,
      `Date: ${EVENT.date}`,
      `Time: ${EVENT.time}`,
      `Venue: ${EVENT.venue} (Google Maps: ${EVENT.googleMapsUrl})`,
      `Reference: ${reference}`,
      "",
      `Please present this reference number or the QR code in your email upon arrival for check-in.`,
      "",
      `We look forward to welcoming you. See you on the 12th.`,
      "",
      `— ${PRIMARY_CLUB} · ${EVENT.district}`,
    ].join("\n"),
    attachments: [
      {
        filename: "qrcode.png",
        content: qrBuffer,
        cid: "rsvp-qrcode", // Matches <img src="cid:rsvp-qrcode" />
      },
      {
        filename: "ganesha.png",
        content: fs.readFileSync(path.join(process.cwd(), "public", "ganesha.png")),
        cid: "ganesha-logo", // Matches <img src="cid:ganesha-logo" />
      },
      {
        filename: "UGAMA_AARAMBHA_Invitation_Poster.jpg",
        path: path.join(process.cwd(), "public", "poster.jpg"),
      },
    ],
  });
}

// ─── Send Welcome & Event Flow Email (Check-in trigger) ──────────────────────

export async function sendWelcomeEventEmail(params: {
  toEmail: string;
  fullName: string;
}): Promise<void> {
  const { toEmail, fullName } = params;

  const from = `${process.env.NODEMAILER_FROM_NAME ?? "UGAMA AARAMBHA"} <${
    process.env.NODEMAILER_FROM ?? process.env.NODEMAILER_USER
  }>`;

  const html = buildWelcomeEventHtml({ fullName });

  await getTransporter().sendMail({
    from,
    to: toEmail,
    replyTo: process.env.NODEMAILER_REPLY_TO ?? from,
    subject: `Welcome to ${EVENT.title} — Event Flow Schedule`,
    html,
    text: [
      `Welcome, ${fullName}!`,
      "",
      `We are thrilled to welcome you to the ${EVENT.fullTitle}. Your check-in has been completed.`,
      "",
      `Venue: ${EVENT.venue} (Google Maps: ${EVENT.googleMapsUrl})`,
      "",
      `--------------------------------------------------`,
      `UGPMA AARPMBHA 2026 – Audience Event Roadmap`,
      `--------------------------------------------------`,
      "",
      `🕠 5:30 PM – 6:00 PM | Arrival & Registration`,
      `  * Guests arrive at the venue.`,
      `  * Registration and networking with fellow Rotaractors, Rotarians, and invitees.`,
      `  * Photo opportunities and seating.`,
      "",
      `🌟 Inaugural Ceremony (6:00 PM – 6:15 PM)`,
      `  * 6:00 PM - Opening Remarks`,
      `  * 6:02 PM - Collaring of the Outgoing Presidents`,
      `  * 6:03 PM - Silent Prayer`,
      `  * 6:04 PM - Rotary Four-Way Test`,
      `  * 6:05 PM - Welcome of Dignitaries & Ceremonial Lamp Lighting`,
      `  * 6:10 PM - Welcome Address by the Outgoing President`,
      "",
      `🎬 Celebrating the Journey (6:15 PM – 6:25 PM)`,
      `  * Glimpse of the Rotary Year Gone By – Rotaract Club of Swarna Bengaluru`,
      `  * Glimpse of the Rotary Year Gone By – Rotaract Club of Bengaluru Nava Chaitanya`,
      "",
      `👑 Presidential Installation Ceremony (6:25 PM – 6:45 PM)`,
      `  * Introduction of Incoming Presidents`,
      `  * Official Installation of the Presidents`,
      `  * Handover of the Gavel`,
      `  * Acceptance Speeches by the Incoming Presidents`,
      "",
      `🤝 Installation of the New Leadership (6:46 PM – 7:05 PM)`,
      `  * Installation of the Board of Directors`,
      `    - Rotaract Club of Swarna Bengaluru`,
      `    - Rotaract Club of Bengaluru Nava Chaitanya`,
      "",
      `🎉 Induction Ceremony (7:06 PM – 7:27 PM)`,
      `  * Induction of New Members`,
      `    - Swarna Bengaluru`,
      `    - Bengaluru Nava Chaitanya`,
      `  * Welcome the newest members into the Rotaract family.`,
      "",
      `🚀 Club Launches (7:28 PM – 7:38 PM)`,
      `  * Witness the unveiling of Official Club Website & Official Club Letterhead for both clubs.`,
      "",
      `🎓 Merit Scholarship Presentation (7:39 PM – 7:45 PM)`,
      `  * Presentation of scholarship cheques to deserving students under the Rtn. Meera Bai Shankar Merit Scholarship.`,
      "",
      `🎤 Addresses by Distinguished Guests (7:46 PM – 8:16 PM)`,
      `  * Inspirational messages from: DRR, YSD, DRCC, Club Advisor & Trainer, and Rotary Club President.`,
      "",
      `📢 Club Announcements (8:17 PM – 8:24 PM)`,
      `  * Important announcements from the dignitaries`,
      `  * Secretary's announcements`,
      `  * Upcoming projects and club updates`,
      "",
      `🙏 Closing Ceremony (8:25 PM – 8:27 PM)`,
      `  * Vote of Thanks`,
      `  * Official conclusion of the Installation Ceremony`,
      "",
      `📸 After the Ceremony`,
      `  * Group photographs`,
      `  * Networking with guests and dignitaries`,
      `  * Fellowship & Dinner`,
      "",
      `--------------------------------------------------`,
      `Event Flow at a Glance`,
      `--------------------------------------------------`,
      `Registration → Opening Ceremony → Year in Review → President Installation → Board Installation → Member Induction → Website & Letterhead Launch → Scholarship Presentation → Guest Addresses → Announcements → Vote of Thanks → Photos • Networking • Dinner`,
      "",
      `Thank you for joining us. Enjoy the installation ceremony.`,
      "",
      `— ${PRIMARY_CLUB} · ${EVENT.district}`,
    ].join("\n"),
    attachments: [
      {
        filename: "ganesha.png",
        content: fs.readFileSync(path.join(process.cwd(), "public", "ganesha.png")),
        cid: "ganesha-logo", // Matches <img src="cid:ganesha-logo" />
      },
    ],
  });
}
