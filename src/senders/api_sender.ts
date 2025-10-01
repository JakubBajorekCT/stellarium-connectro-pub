import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { type BaseSenderOptions, BaseSender } from './base_sender.ts';
import {
  type StellariumStatusLocation,
  type StellariumStatusTime,
  type StellariumView,
} from '../types/stellarium.ts';
import { type Vector3 } from '../types/coordinates.ts';
import type { LocationDecimal } from '../types/location.ts';

export type ApiSenderOptions = BaseSenderOptions & {};

export class ApiSender extends BaseSender {
  private readonly opts: ApiSenderOptions;
  private readonly api: AxiosInstance;

  constructor(opts: ApiSenderOptions) {
    super();
    this.opts = opts;
    this.api = axios.create({
      baseURL: `http://${this.opts.apiHost}:${this.opts.apiPort}/api`,
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public override async getLocation(): Promise<StellariumStatusLocation> {
    const res: AxiosResponse = await this.api.get('/main/status');
    return res.data.location;
  }

  public override async setLocation(location: LocationDecimal): Promise<boolean> {
    const params: URLSearchParams = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
    });
    const headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    await this.api.post('/location/setlocationfields', params, headers);
    return true;
  }

  public override async getTime(): Promise<StellariumStatusTime> {
    const res: AxiosResponse = await this.api.get('/main/status');
    return res.data.time;
  }

  public override async setTime(julianDate: number): Promise<boolean> {
    const params: URLSearchParams = new URLSearchParams({
      time: julianDate.toString(),
    });
    const headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    await this.api.post('/main/time', params, headers);
    return true;
  }

  public override async getViewCoordinates(): Promise<StellariumView> {
    const res: AxiosResponse = await this.api.get('/main/view');
    return {
      jNow: JSON.parse(res.data.jNow),
      altAz: JSON.parse(res.data.altAz),
      j2000: JSON.parse(res.data.j2000),
    };
  }

  public override async setViewCoordinates(coords: Vector3, paramName: string): Promise<boolean> {
    const params: URLSearchParams = new URLSearchParams({
      [paramName]: JSON.stringify(coords),
    });
    const headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    await this.api.post('/main/view', params, headers);
    return true;
  }

  public override async moveView(x: number, y: number): Promise<boolean> {
    const params: URLSearchParams = new URLSearchParams({
      x: x.toString(),
      y: y.toString(),
    });
    const headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    await this.api.post('/main/move', params, headers);
    return true;
  }
}
