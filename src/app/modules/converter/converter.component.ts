import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrencyConverterService} from "../../core/services/currency-converter.service";
import {
  BehaviorSubject,
  debounce,
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
  Observable, Subject,
  switchMap, takeUntil
} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ICurrency} from "../../core/models/currency.interface";
import {ConvertResult} from "../../core/models/convert-result.interface";

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit, OnDestroy {

  public currenciesList$: Observable<Array<ICurrency>> = this.currencyConverterService.getCurrencies();

  public form: FormGroup = new FormGroup({
    amount: new FormControl(0, [Validators.required, Validators.min(1)]),
    fromCurrency: new FormControl('', [Validators.required]),
    toCurrency: new FormControl('', [Validators.required]),
  });

  public convertResultText$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private currencyConverterService: CurrencyConverterService) {
    const history: Array<ConvertResult> = this.currencyConverterService.getHistory();
    if (history && history.length > 0) {
      const lastConvert: ConvertResult = history[history.length - 1];
      this.form.setValue({
        amount: lastConvert.amount,
        fromCurrency: lastConvert.from,
        toCurrency: lastConvert.to,
      }, {emitEvent: false});

      this.convertResultText$.next(this.formatResultString(lastConvert));
    }
  }

  public ngOnInit(): void {
    this.form.valueChanges.pipe(
      distinctUntilChanged(),
      filter(() => this.form.valid),
      debounceTime(600),
      switchMap(() => {
        return this.currencyConverterService.convert({
          amount: this.form.get('amount')?.value,
          from: this.form.get('fromCurrency')?.value,
          to: this.form.get('toCurrency')?.value
        })
      }),
      takeUntil(this.destroy$),
    ).subscribe((convertResult: ConvertResult | undefined) => {
      if (convertResult) {
        this.convertResultText$.next(this.formatResultString(convertResult));
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private formatResultString(convertResult: ConvertResult): string {
    return `${convertResult?.amount} ${convertResult?.from} = ${convertResult?.convertedAmount} ${convertResult?.to}`;
  }
}
