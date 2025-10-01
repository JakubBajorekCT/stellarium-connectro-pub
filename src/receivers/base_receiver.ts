import { type BaseSender } from '../senders/base_sender.ts';

export type BaseReceiverOptions = {
  sender: BaseSender;
};

export class BaseReceiver {
  public async process(_data: Buffer<ArrayBufferLike>): Promise<number[]> {
    throw new Error('process() must be implemented in a subclass of BaseReceiver');
  }
}
