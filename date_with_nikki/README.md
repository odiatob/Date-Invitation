# Date Invitation

A mobile-friendly date invitation app with a playful background, a moving `No` button, a questionnaire flow, and SMS confirmation.

## Run locally

```powershell
npm install
npm run dev
```

## SMS setup

To send the final confirmation text, set these environment variables:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`

Copy `.env.example` to `.env.local` and fill in your Twilio values.

## Flow

1. Open the page.
2. Click `YES`.
3. Answer the queued questions one by one.
4. Enter a phone number.
5. Send the confirmation text.
