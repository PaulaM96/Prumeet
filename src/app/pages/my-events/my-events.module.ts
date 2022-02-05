import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyEventsPageRoutingModule } from './my-events-routing.module';

import { MyEventsPage } from './my-events.page';
import { CalendarioPageRoutingModule } from '../calendario/calendario-routing.module';
import { NgCalendarModule } from 'ionic2-calendar';
import {LOCALE_ID} from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyEventsPageRoutingModule,
    CalendarioPageRoutingModule,
    NgCalendarModule,
  ],
  declarations: [MyEventsPage],
  providers: [
    MyEventsPage,
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
})
export class MyEventsPageModule {}
