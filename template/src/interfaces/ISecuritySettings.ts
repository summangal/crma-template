export interface ISecurityObject {
  vendorName: string;
  status: boolean;
  id: string;
}
export interface IAccessDeviceObject {
  browser: string;
  os: string;
  os_version: string;
  isotimestamp: string;
  browser_version: string;
}
export interface ISecuritySettings {
  securityData: ISecurityObject[];
  date: string;
}
export interface ISecurityTable {
  securityData: ISecurityObject[];
  resetProvider: () => void;
}
