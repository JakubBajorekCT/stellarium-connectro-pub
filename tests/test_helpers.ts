import { Socket } from 'node:net';
import { stringToAsciiArray } from '../src/shared_helpers';

export function coordinatesBodyToArray(body: string, paramName: string): number[] {
  const paramsFromBody: URLSearchParams = new URLSearchParams(body);
  const selectedParam: string | null = paramsFromBody.get(paramName);
  if (selectedParam) {
    return JSON.parse(decodeURIComponent(selectedParam));
  } else {
    throw new Error(`Cannot get ${paramName} param from body: ${body}`);
  }
}

export function coordinatesBodyToNumber(body: string, paramName: string): number {
  const paramsFromBody: URLSearchParams = new URLSearchParams(body);
  const selectedParam: string | null = paramsFromBody.get(paramName);
  if (selectedParam) {
    return Number(decodeURIComponent(selectedParam));
  } else {
    throw new Error(`Cannot get ${paramName} param from body: ${body}`);
  }
}

export class SocketClient {
  private readonly host: string;
  private readonly port: number;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
  }

  public async send(data: string): Promise<string> {
    const socket: Socket = new Socket();
    await this.connect(socket);
    await this.write(socket, stringToAsciiArray(data));
    const res: Buffer<ArrayBufferLike> = await this.read(socket);
    this.end(socket);
    return res.toString();
  }

  // =====================================================================================================================

  private connect(s: Socket): Promise<void> {
    return new Promise((resolve, reject) => {
      s.connect(this.port, this.host, () => resolve());
      s.once('error', reject);
    });
  }

  private write(s: Socket, data: number[]): Promise<void> {
    return new Promise((resolve, reject) => {
      s.write(Buffer.from(data), (err: Error | null | undefined) =>
        err ? reject(err) : resolve(),
      );
    });
  }

  private read(s: Socket): Promise<Buffer> {
    return new Promise(resolve => {
      s.once('data', resolve);
    });
  }

  private end(s: Socket): void {
    s.end();
  }
}
