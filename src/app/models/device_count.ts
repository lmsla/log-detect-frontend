export class Device {
  public created_at: number;
  public updated_at: number;
  public deleted_at: number | null;
  public id: number;
  public name: string;
  public device_group: string;
}


export class Common {
  public created_at: number;
  public updated_at: number;
  public deleted_at: number;
}

export interface DeviceCount {
  device_group: string;
  devices_count: number;
}
