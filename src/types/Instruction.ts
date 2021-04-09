export class Instruction {
  public kind: string;
  public variationId?: string;
  public values: string[];

  constructor(init?: Partial<Instruction>) {
    Object.assign(this, init);
  }
};