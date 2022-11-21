import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of, shareReplay} from "rxjs";
import {ICurrency} from "../models/currency.interface";
import {ConvertResult, IConvertResult} from "../models/convert-result.interface";

const HOST: string = 'https://api.frankfurter.app';
const LOCAL_HISTORY_KEY = 'convertHistory';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConverterService {

  private readonly convertResults: Array<ConvertResult> = [];

  private currenciesCash$: Observable<Array<ICurrency>> | undefined = undefined;

  constructor(private httpClient: HttpClient) {
    const history = localStorage.getItem(LOCAL_HISTORY_KEY);
    if (history) {
      this.convertResults = JSON.parse(history);
    }
  }

  public getCurrencies(): Observable<Array<ICurrency>> {
    if (!this.currenciesCash$) {
      this.currenciesCash$ = this.httpClient.get<Record<string, string>>(`${HOST}/currencies`).pipe(
        map((result: Record<string, string>) => {
          return Object.keys(result).map((key: string) => <ICurrency>{code: key, name: (result as any)[key] as string});
        }),
        shareReplay(1),
        catchError((error) => {
          console.log(error);
          return of([]);
        }),
      )
    }

    return this.currenciesCash$;
  }

  public convert(data: IConvertData): Observable<ConvertResult | undefined> {
    return this.httpClient.get<IConvertResult>(`${HOST}/latest?amount=${data.amount}&from=${data.from}&to=${data.to}`).pipe(
      map((result: IConvertResult) => {
        const convertResult: ConvertResult = new ConvertResult(result, data.to);
        this.convertResults.push(convertResult);
        localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(this.convertResults));
        return convertResult;
      }),
      catchError((err) => {
        console.log('convert error', err);
        return of(undefined);
      }),
    )
  }

  public getHistory(): Array<ConvertResult> {
    return this.convertResults.sort((a: ConvertResult, b: ConvertResult) => b.date.localeCompare(a.date));
  }
}

export interface IConvertData {
  amount: number;
  from: string;
  to: string;
}
