import { App } from '@slack/bolt';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.SLACK_BOT_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;
const port = Number(process.env.PORT) || 3000;

if (!token || !signingSecret) {
  console.error('Missing SLACK_BOT_TOKEN or SLACK_SIGNING_SECRET in environment');
  process.exit(1);
}

const app = new App({
  token,
  signingSecret,
});

// Respond to the /hello command
app.command('/hello', async ({ ack, respond, command }: any) => {
  await ack();
  await respond(`Hello, <@${command.user_id}>!`);
});

// Log all channel messages
app.event('message', async ({ event, logger }: any) => {
  logger.info('Received message event', event);
});

(async () => {
  await app.start(port);
  console.log(`⚡️ Bolt app is running on port ${port}`);
})();
