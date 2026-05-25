import { NextResponse } from "next/server";

type SmsBody = {
  phoneNumber?: string;
  details?: {
    when?: string;
    time?: string;
    activity?: string;
    where?: string;
  };
};

function buildMessage(details: Required<NonNullable<SmsBody["details"]>>) {
  return [
    "Date confirmation 💗",
    `When: ${details.when}`,
    `Time: ${details.time}`,
    `Activity: ${details.activity}`,
    `Where: ${details.where}`,
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SmsBody;
    const phoneNumber = body.phoneNumber?.trim();
    const details = body.details;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "A phone number is required." },
        { status: 400 },
      );
    }

    if (!details?.when || !details?.time || !details?.activity || !details?.where) {
      return NextResponse.json(
        { error: "Missing date details." },
        { status: 400 },
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json(
        {
          error:
            "SMS is not configured yet. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER.",
        },
        { status: 500 },
      );
    }

    const message = buildMessage(details as Required<NonNullable<SmsBody["details"]>>);
    const formData = new URLSearchParams();
    formData.set("To", phoneNumber);
    formData.set("From", fromNumber);
    formData.set("Body", message);

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: `Twilio rejected the message request: ${errorText}`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      message: "Confirmation text sent successfully.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to send the confirmation text." },
      { status: 500 },
    );
  }
}
