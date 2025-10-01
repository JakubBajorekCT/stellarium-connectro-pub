import { createServer, type Server, type Socket } from 'node:net';
import { logger } from './logger.ts';
import { type BaseReceiver } from './receivers/base_receiver.ts';
import { asciiArrayToString } from './shared_helpers.ts';

export type StellariumConnectroServerOptions = {
  port: number;
  receiver: BaseReceiver;
};

type OnDataFn = (data: Buffer<ArrayBufferLike>) => void;

export class StellariumConnectroServer {
  private readonly socketServer: Server;
  private readonly opts: StellariumConnectroServerOptions;

  constructor(opts: StellariumConnectroServerOptions) {
    this.opts = opts;
    this.socketServer = createServer((socket: Socket): void => {
      logger.info('Client connected');
      socket.on('data', this.onData(socket));
      socket.on('end', this.onEnd);
      socket.on('error', this.onError);
    });
  }

  private onData(socket: Socket): OnDataFn {
    return (data: Buffer<ArrayBufferLike>): void => {
      void (async (): Promise<void> => {
        try {
          const res: number[] = await this.opts.receiver.process(data);
          socket.write(asciiArrayToString(res));
        } catch (err) {
          logger.error('Error handling data:', err);
          socket.destroy();
        }
      })();
    };
  }

  private onEnd(): void {
    logger.info('Client disconnected');
  }

  private onError(err: Error): void {
    logger.error('Socket error:', err);
  }

  public async start(): Promise<void> {
    this.socketServer.listen(this.opts.port, (): void => {
      logger.info(`Server listening on port ${this.opts.port}`);
    });
  }

  public async stop(): Promise<void> {
    this.socketServer.close();
  }

  public status(): boolean {
    return this.socketServer.listening;
  }
}
