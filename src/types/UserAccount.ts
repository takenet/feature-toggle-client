export class UserAccount {
  public id: number;
  public address: string;
  public email: string;
  public fullName: string;
  public password: string;
  public phoneNumber: string;
  public whatsAppPhoneNumber?: string;
  public culture: string;
  public isPending: boolean;
  public company: string;
  public position?: string;
  public expiration?: string;
  public city?: string;
}
