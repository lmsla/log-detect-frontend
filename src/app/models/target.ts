export class Targets {
  public created_at: number;
  public updated_at: number;
  public deleted_at: number;
  public id: number;
  public subject: string;
  public to: string;
  public enable: boolean;
  public indices: Array<Index>;
  constructor() {
    this.indices = new Array<Index>();
  }

}

export class Index {

  public id: number;
  public target_id: number;
  public pattern: string;
  public logname: string;

}



export class Indices {
  public created_at: number;
  public updated_at: number;
  public deleted_at: number;
  public id: number;
  public target_id: number;
  public pattern: string;
  public logname: string;
  public device_group: string;
  public period: string;
  public unit: number;
  public field: string

}


export class DeviceGroup {
  public device_group: string;
}


export class Logname {
  public logname: string;
}
