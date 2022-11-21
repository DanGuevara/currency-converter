import {Component} from '@angular/core';
import {CurrencyConverterService} from "../../core/services/currency-converter.service";
import {ConvertResult} from "../../core/models/convert-result.interface";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {

  public history: Array<ConvertResult> = this.currencyConverterService.getHistory();

  public constructor(private currencyConverterService: CurrencyConverterService) {
  }
}
