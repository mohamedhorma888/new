# Node.js Guided Exercises

Files added for exercises:

- `hello-world.js` — prints "HELLO WORLD"
- `server.js` — simple HTTP server on port 3000
- `write-welcome.js` — creates `welcome.txt` with "Hello Node"
- `read-hello.js` — reads and logs `hello.txt`
- `welcome.txt`, `hello.txt` — sample text files
- `password-generator.js` — uses `generate-password` to produce a random password
- `email-sender.js` — example using `nodemailer`; requires SMTP env vars

Quick Start

1. Install Node.js (if not installed).
2. In the `node.js` folder run:

```bash
npm install
```

Run examples:

```bash
node hello-world.js
node server.js          # then open http://localhost:3000
node write-welcome.js   # creates welcome.txt
node read-hello.js      # reads hello.txt and prints contents
node password-generator.js
```

Email sender

Set these environment variables before running `email-sender.js`:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM`, `TO`

Example (Windows PowerShell):

```powershell
$env:SMTP_HOST = 'smtp.example.com'
$env:SMTP_PORT = '587'
$env:SMTP_USER = 'user@example.com'
$env:SMTP_PASS = 'yourpassword'
$env:FROM = 'user@example.com'
$env:TO = 'you@example.com'
node email-sender.js
```

Reminder: remove personal credentials before committing to a public repo.
