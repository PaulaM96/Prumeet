  import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CalendarioPageRoutingModule } from './calendario-routing.module';
import { CalendarioPage } from './calendario.page';
import { NgCalendarModule  } from 'ionic2-calendar';
import { CalModalPageModule } from '../cal-modal/cal-modal.module';
 
import {LOCALE_ID} from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarioPageRoutingModule,
    NgCalendarModule,
    CalModalPageModule
  ],
  declarations: [CalendarioPage],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
})
export class CalendarioPageModule {}