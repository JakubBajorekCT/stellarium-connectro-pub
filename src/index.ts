import { type BaseSender } from './senders/base_sender.ts';
import { ApiSender, type ApiSenderOptions } from './senders/api_sender.ts';
import { logger } from './logger.ts';
import { settings } from './settings.ts';

const senderOpts: ApiSenderOptions = {
  apiHost: settings.stellariumHost,
  apiPort: settings.stellariumPort,
};
const sender: BaseSender = new ApiSender(senderOpts);

// =====================================================================================================================

import { type BaseReceiver } from './receivers/base_receiver.ts';
import { NexstarReceiver, type NexstarReceiverOptions } from './receivers/nexstar_receiver.ts';

const receiverOpts: NexstarReceiverOptions = {
  sender: sender,
};
const receiver: BaseReceiver = new NexstarReceiver(receiverOpts);

// =====================================================================================================================

import {
  StellariumConnectroServer,
  type StellariumConnectroServerOptions,
} from './stellarium_connectro_server.ts';

const opts: StellariumConnectroServerOptions = {
  port: settings.connectroPort,
  receiver: receiver,
};
logger.info(`Starting with settings: ${JSON.stringify(settings)}`);
const s: StellariumConnectroServer = new StellariumConnectroServer(opts);

// =====================================================================================================================

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down...');
  process.exit(0);
});

await s.start();
