import { Instruction } from '../types/Instruction';

export class AddUserRequest {
  public comment: string;
  public environmentKey?: string;
  public instructions: Instruction[];

  constructor(init?: Partial<AddUserRequest>) {
    Object.assign(this, init);
  }
}