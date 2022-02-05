import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import { Event } from 'src/app/models/event';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EventRecordService } from 'src/app/services/event-record/event-record.service';
import { any } from 'underscore';
import { CalModalPage } from '../cal-modal/cal-modal.page';
import { EditEventPage } from '../edit-event/edit-event.page';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
})
export class MyEventsPage implements OnInit {

  events = [];
  eventSource =[];
  automaticClose=false;
  id:number;
  event = new Event();
  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(
    private alertController: AlertController,
    @Inject(LOCALE_ID) private locale: string,
    private authService: AuthService, 
    private modalCtrl: ModalController,
    private router: Router,
    private eventService: EventRecordService,
    private menuCtrl: MenuController,
    private alertService: AlertService,
  ) { 
      this.refresh();
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  toggleSection(index) {
    this.events[index].open = !this.events[index].open;
   
    if (this.automaticClose  && this.events[index].open){
      this.events
      .filter((event,eventIndex)=>eventIndex != index)
      .map(event => event.open =false);
    }
  }

  ngOnInit() {

  }

  refresh(){

    this.eventService.getEventsByUser().subscribe((data:Array<any>)=>{
      let i = 0;
      this.events=[];
      for(i=0; i<data.length; i++){
        data[i].startTime = new Date (data[i].startTime.replace(/-/g, "/"));
        data[i].endTime = new Date (data[i].endTime.replace(/-/g, "/"));
      }
      this.events= data;
      this.events[0].open = true;
    })
    
  }


  async editEvent(id){

    this.id=id;
    const modal = await this.modalCtrl.create({
      component: EditEventPage,
      componentProps:{
        'idEvent': this.id 
      },
      cssClass: 'cal-modal',
      backdropDismiss: false,
      
      
    });
    await modal.present();
   
    modal.onDidDismiss().then((result) => {
      //depois de verificar se a data está disponível

      
      let event : Event = result.data.event;
       if (result.data && result.data.event) {
        this.eventService.update(event,this.id)
        .then(
          (data: any) => {
            this.refresh();
            this.alertService.presentToast('Evento Atualizado com sucesso!');
           
            //inserir mensagem de evento atualizado com sucesso!
          },
          error => {
            this.alertService.presentToast('Ocorreu um erro, tente novamente mais tarde!');
          })  
      }
    }  
    );
  }
  
  async remove(id){
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Atenção!',
        message: '<strong>Você tem certeza que deseja excluir este evento?</strong>',
        buttons: [
          {
            text: 'Cancelar',
            role: 'Cancelar',
            cssClass: 'secondary',
            handler: (blah) => {
            }
          }, {
            text: 'Ok',
            handler: (blah) => {
              this.eventService.delete(id).subscribe((data:any)=>{
                this.alertService.presentToast('Evento excluído com sucesso!');
                this.refresh();
              },
              error => {
                this.alertService.presentToast('Ocorreu um erro, tente novamente mais tarde!');
              })  
            }
          }
        ]
      });
  
      await alert.present();
    }
  

    async openCalModal() {
      const modal = await this.modalCtrl.create({
        component: CalModalPage,
        cssClass: 'cal-modal',
        backdropDismiss: false
        
      });
     
      await modal.present();
     
      modal.onDidDismiss().then((result) => {
        //depois de verificar se a data está disponível


        let initialDate=new Date(result.data.event.startTime);
        let finalDate=new Date(result.data.event.endTime);
        let auxEvent : Event = result.data.event;
        let event : Event = result.data.event;

        
         if (result.data && result.data.event) {
          
          this.eventService.createAPI(auxEvent);
          }
          event.startTime=new Date(initialDate);
          event.endTime=new Date(finalDate);
          this.eventSource.push(event);
          this.refresh();
        }
      );
    }
 
}
