import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ConverterRoutingModule} from './converter-routing.module';
import {ConverterComponent} from './converter.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ConverterComponent
  ],
  imports: [
    CommonModule,
    ConverterRoutingModule,
    ReactiveFormsModule
  ]
})
export class ConverterModule {
}
