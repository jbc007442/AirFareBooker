import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { businessName, firstName, lastName, email, phone, amount } = body;

    // ✅ fallback if empty
    const brand = businessName || 'Reservation Desk';

    // 🔗 Pass business name in URL
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?amount=${amount}&name=${firstName}&phone=${phone}&business=${encodeURIComponent(brand)}`;

    // ✅ Mail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // ✅ Email UI (with dynamic branding)
    const htmlContent = `
      <div style="font-family: Arial; background:#f6f9fc; padding:20px;">
        <div style="max-width:500px; margin:auto; background:white; border-radius:10px; padding:20px;">
          
          <!-- 🔥 Business Name -->
          <p style="color:#6b7280; font-size:14px; margin-bottom:5px;">
            ${brand}
          </p>

          <h2 style="margin-top:0;">Payment Request</h2>

          <p>Hello <b>${firstName} ${lastName}</b>,</p>
          <p>Please complete your payment:</p>

          <!-- Amount -->
          <div style="background:#f1f5f9; padding:12px; border-radius:8px; margin:15px 0;">
            <p style="margin:0; color:#6b7280;">Amount</p>
            <h2 style="margin:5px 0;">₹${amount}</h2>
          </div>

          <!-- Button -->
          <a href="${link}" style="
            display:block;
            text-align:center;
            padding:12px;
            background:#0a2540;
            color:white;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold;
          ">
            Pay Now
          </a>

          <p style="margin-top:15px;"><b>Phone:</b> ${phone}</p>

          <p style="font-size:12px; color:#999;">
            If button doesn't work:<br/>
            <a href="${link}">${link}</a>
          </p>

        </div>
      </div>
    `;

    // ✅ Send mail
    await transporter.sendMail({
      from: `"${brand}" <${process.env.EMAIL_USER}>`, // 🔥 dynamic sender
      to: email,
      subject: `${brand} - Payment Request`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Mail Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
