import { Client, GatewayIntentBits } from 'discord.js';
import { Service } from 'typedi';
import { BOT_TOKEN } from '@config';
import { logger } from '@utils/logger';

@Service()
export class DiscordBot {
  private client: Client;
  private token: string;

  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });

    this.token = BOT_TOKEN;

    this.client.once('ready', () => {
      logger.info(`Logged in as ${this.client.user?.tag}`);
    });

    this.client.login(this.token);
  }

  public async sendDMToUser(userId: string, content: string) {
    try {
      const user = await this.client.users.fetch(userId);

      if (user) {
        user
          .send(content)
          .then(sentMessage => logger.info(`DM sent to ${user.tag}: ${sentMessage.content}`))
          .catch(error => logger.error(`Error sending DM to ${user.tag}: ${error.message}`));
      } else {
        logger.error('User not found.');
      }
    } catch (error) {
      logger.error(`Error fetching user with ID ${userId}: ${error.message}`);
    }
  }
}

export default DiscordBot;
