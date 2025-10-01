import type {
  StellariumStatusLocation,
  StellariumStatusTime,
  StellariumView,
} from '../types/stellarium';
import type { Vector3 } from '../types/coordinates';
import type { LocationDecimal } from '../types/location.ts';

export type BaseSenderOptions = {
  apiHost: string;
  apiPort: number;
};

export class BaseSender {
  public async getViewCoordinates(): Promise<StellariumView> {
    throw new Error('getViewCoordinates() must be implemented in a subclass of BaseSender');
  }
  public async getTime(): Promise<StellariumStatusTime> {
    throw new Error('getTime() must be implemented in a subclass of BaseSender');
  }

  public async setTime(_julianDate: number): Promise<boolean> {
    throw new Error('setTime() must be implemented in a subclass of BaseSender');
  }

  public async getLocation(): Promise<StellariumStatusLocation> {
    throw new Error('getLocation() must be implemented in a subclass of BaseSender');
  }

  public async setLocation(_location: LocationDecimal): Promise<boolean> {
    throw new Error('setLocation() must be implemented in a subclass of BaseSender');
  }

  public async setViewCoordinates(_coords: Vector3, _paramName: string): Promise<boolean> {
    throw new Error('getLocation() must be implemented in a subclass of BaseSender');
  }

  public async moveView(_x: number, _y: number): Promise<boolean> {
    throw new Error('moveView() must be implemented in a subclass of BaseSender');
  }
}
