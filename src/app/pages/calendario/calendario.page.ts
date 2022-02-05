import { CalendarComponent } from 'ionic2-calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { CalModalPage } from '../cal-modal/cal-modal.page';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IonSlides } from '@ionic/angular';
import { RoomService } from 'src/app/services/room/room.service';
import { EventRecordService } from 'src/app/services/event-record/event-record.service';
import { Event } from 'src/app/models/event';
import { AlertService } from 'src/app/services/alert/alert.service';



@Component({
  selector: 'app-calendario',
  templateUrl: 'calendario.page.html',
  styleUrls: ['calendario.page.scss'],
})
export class CalendarioPage implements OnInit {
  eventSource = [];
  viewTitle: string;
  
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    queryMode: 'remote',
    locale: 'pt-BR'
  };
  countEvents: number;
  rooms:any[];
  selectedDate: Date;
  getRooms: number;

  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  @ViewChild(IonSlides) productSlider: IonSlides;
  @ViewChild('slideRoom') slides: IonSlides;

  constructor(
    private alertCtrl: AlertController,
    @Inject(LOCALE_ID) private locale: string,
    private modalCtrl: ModalController,
    private authService: AuthService, 
    private router: Router,
    private roomService: RoomService,
    private eventService: EventRecordService,
    private alertService: AlertService,
    private menuCtrl: MenuController,
  ){
    this.getRooms=0;

  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  slideChanged() {
    this.getRooms=0;
    this.slides.slideTo(0);
  }
  
  onRangeChanged = (ev: {startTime : Date, endTime : Date})=>{
     this.eventService.getEventsAPI().subscribe( (data:Array<any>)=>{
      let i = 0;
      for(i=0; i<data.length; i++){
        data[i].startTime = new Date (data[i].startTime.replace(/-/g, "/"));
        data[i].endTime = new Date (data[i].endTime.replace(/-/g, "/"));
      }
      this.eventSource= data;
      this.myCal.loadEvents();
      })
  }  

  ngOnInit() {
    setTimeout(async () => {
      this.doRefresh(event);
    }, 1500);
  }

  ionViewWillEnter() {

    this.eventService.getEventsAPI().subscribe((data:Array<any>)=>{
      let i = 0;
      this.eventSource=[];
      for(i=0; i<data.length; i++){
        data[i].startTime = new Date (data[i].startTime.replace(/-/g, "/"));
        data[i].endTime = new Date (data[i].endTime.replace(/-/g, "/"));
      }
      this.eventSource= data;
      this.myCal.loadEvents(); 
    })
    
    }

  getEventRooms(room: number){
    this.eventSource=[];
    this.eventService.getEventsByRoomAPI(room).subscribe( (data:Array<any>)=>{
      let i = 0;
      for(i=0; i<data.length; i++){
        data[i].startTime = new Date (data[i].startTime.replace(/-/g, "/"));
        data[i].endTime = new Date (data[i].endTime.replace(/-/g, "/"));
      }
      this.eventSource= data;
      this.myCal.loadEvents();
      })
  }

  getEvents(){
    this.eventSource=[];
    this.eventService.getEventsAPI().subscribe( (data:Array<any>)=>{
      let i = 0;
      for(i=0; i<data.length; i++){
        data[i].startTime = new Date (data[i].startTime.replace(/-/g, "/"));
        data[i].endTime = new Date (data[i].endTime.replace(/-/g, "/"));
      }
      this.eventSource= data;
      this.myCal.loadEvents();
      })
  }

  doRefresh(event) {
    
     this.authService.testConnectionAPI()
        .then(async (c) => {
            await this.eventService.getEventsAPI()
                .subscribe(async (data: Array<any>) => {
                    if (data.length != 0) {
                      let i=0;
                      for(i=0; i<data.length; i++){
                        data[i].startTime = new Date (data[i].startTime.replace(/-/g, "/"));
                        data[i].endTime = new Date (data[i].endTime.replace(/-/g, "/"));
                      }
                      this.eventSource=[];
                      this.eventSource= data;
                                if (data) {
                                    this.alertService.presentToast('Registros Sincronizados');
                                    event.target.complete();
                                    this.myCal.loadEvents();
                                    //atualizar contagem
                                } else {
                                    this.alertService.presentToast('Erro ao sincronizar registros');
                                    event.target.complete();
                                }
                            ;
                    }
                });
        })
        .catch((error) => {
            this.alertService.presentToast('Falha na conexão com a internet');
            console.log('error connection ', error);
        });
}

  // Change current month/week/day
  next() {
    this.getRooms=0;
    this.myCal.slideNext();
    this.slides.slideTo(0);
  }
  
  back() {
    this.getRooms=0;
    this.myCal.slidePrev();
    this.slides.slideTo(0);
  }

  nextLocal(){
    this.getRooms= this.getRooms+1;
    this.eventSource=[];
    this.slides.slideNext();
    this.getEventRooms(this.getRooms);
        

  }

  prevLocal(){
    this.getRooms= this.getRooms-1;
    this.eventSource=[];
    if((this.getRooms==0)||(this.getRooms==-1)){
      this.getRooms=0;
      this.slides.slideTo(0);
      this.getEvents();
    }
    else if(this.getRooms==1){
      this.slides.slidePrev();
      this.getEventRooms(this.getRooms);
    }
    else{
      this.slides.slidePrev();
      this.getEventRooms(this.getRooms);
    }
  }
 
  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
 
  // Calendar event was clicked
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    await this.doRefresh(event);
    let start = formatDate(event.startTime, 'long', this.locale);
    let end = formatDate(event.endTime, 'long', this.locale);
    let events = this.eventService.events;
    let i=0;
    let roomDesc;
    for(i=0;i<events.length;i++){
      if(events[i].id===event.id){
        roomDesc=events[i].room.name;
      }
    }
 
    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.description,
      message: 'De: ' + start + '<br><br>Até: ' + end +'<br><br>Sala:'+ roomDesc,
      buttons: ['OK'],
    });
    alert.present();
  }

  async logout() {
    this.eventService.deleteRows();
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
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
        this.myCal.loadEvents();
      }
    );
  }
 
}
