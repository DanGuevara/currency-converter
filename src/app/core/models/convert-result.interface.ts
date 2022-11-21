export class ConvertResult {
  public readonly amount: number;
  public readonly from: string;
  public readonly date: string;
  public readonly to: string;
  public readonly convertedAmount: number;

  public constructor(data: IConvertResult, to: string) {
    this.amount = data.amount;
    this.from = data.base;
    this.date = new Date().toISOString();
    this.to = to;
    this.convertedAmount = data.rates[to];
  }
}

export interface IConvertResult {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}
