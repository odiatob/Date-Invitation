# Date Invitation

A mobile-friendly date invitation app with a playful background, a moving `No` button, a questionnaire flow, and EmailJS confirmation.

## Run locally

```powershell
npm install
npm run dev
```

## EmailJS setup

The app is already configured with the EmailJS values you provided:

- service ID: `service_o5buunn`
- template ID: `template_91n3tw8`
- public key: `6zUxxpUGs9dDk27Zj`

If you want to change them later, edit the constants near the top of [app/page.tsx](app/page.tsx).

Notes:

- The EmailJS template should include variables for `to_email`, `reply_to`, `when`, `time`, `activity`, and `where`.
- The public key is safe to expose in the browser because EmailJS uses it client-side.
- If you want to send to yourself as well, add a second recipient field in your EmailJS template.

## Flow

1. Open the page.
2. Click `YES`.
3. Answer the queued questions one by one.
4. Enter an email address.
5. Send the confirmation email.
