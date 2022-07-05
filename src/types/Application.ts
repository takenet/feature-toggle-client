export class Application {
  public imageUri: string;
  public id: number;
  public shortName: string;
  public name: string;
  public accessKey: string;
  public template: string;
  public created: string;
  public activatedServices: any[];
  public applicationUserPermissionModel: IApplicationUserPermissionModel[];
  public applicationDomainActivations: IApplicationDomainActivation[];
  public isTemplate: boolean;
  public status: string;
  public hasCluster: boolean;
  public applicationJson: IApplicationJson;

  constructor(init?: Partial<Application>) {
    Object.assign(this, init);
  }
}

interface IApplicationJson {
  identifier: string;
  instance?: any;
  domain?: any;
  scheme?: any;
  hostName?: any;
  port?: any;
  accessKey: string;
  password?: any;
  sendTimeout: number;
  defaultMessageReceiverLifetime: string;
  messageReceivers: IMessageReceiver[];
  notificationReceivers?: any;
  commandReceivers?: any;
  startupType?: any;
  serviceProviderType: string;
  stateManagerType?: any;
  sessionEncryption?: any;
  sessionCompression?: any;
  schemaVersion: number;
  routingRule?: any;
  throughput: number;
  disableNotify: boolean;
  channelCount?: any;
  receiptEvents?: any;
  registerTunnelReceivers: boolean;
  settings: IApplicationSettings;
  settingsType: string;
}

interface IApplicationSettings {
  flow: any;
}

interface IMessageReceiver {
  mediaType?: any;
  content?: any;
  lifetime?: any;
  priority: number;
  state?: any;
  outState?: any;
  type: string;
  sender?: any;
  destination?: any;
  culture?: any;
  response?: any;
  forwardTo?: any;
  settings?: any;
  settingsType?: any;
}

interface IApplicationDomainActivation {
  domain: IDomain;
  isActive: boolean;
  properties: IProperties;
}

interface IProperties {
  pageAccessToken: string;
  pageId: string;
}

interface IDomain {
  shortName: string;
  fqdn: string;
}

interface IApplicationUserPermissionModel {
  permissionClaim: number;
  permissionAction: number;
}
