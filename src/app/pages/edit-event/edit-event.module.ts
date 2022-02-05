import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditEventPageRoutingModule } from './edit-event-routing.module';

import { EditEventPage } from './edit-event.page';
import { NgCalendarModule } from 'ionic2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditEventPageRoutingModule,
    NgCalendarModule,

  ],
  declarations: [EditEventPage]
})
export class EditEventPageModule {}
