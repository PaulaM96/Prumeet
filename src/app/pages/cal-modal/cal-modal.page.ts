import { Component, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import { RoomService } from 'src/app/services/room/room.service';
import { Event } from 'src/app/models/event';
import { EventRecordService } from 'src/app/services/event-record/event-record.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from 'src/app/services/auth/auth.service';



@Component({
  selector: 'app-cal-modal',
  templateUrl: './cal-modal.page.html',
  styleUrls: ['./cal-modal.page.scss'],
})



export class CalModalPage implements AfterViewInit {
  
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  viewTitle: string;
  
  
  ionicForm: FormGroup;
  isSubmitted = false;
  rooms = [];  
  eventDate : Date;
  day: number;
  month: number;
  year: number;
  startTime: any;
  endTime: any;
  event = new Event();
    
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  modalReady = false;
  loadReady = false;
  currentDateSelected=false;

  
 
  constructor(
    private modalCtrl: ModalController,
    private roomService: RoomService,
    private cdr: ChangeDetectorRef,
    private eventService: EventRecordService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private storage: NativeStorage,
    private authService: AuthService
    ) { 
      
    }
    
    //this.myCal.loadEvents();

    ngOnInit(){
    
    this.roomService.getRoomsAPI().subscribe((data:Array<any>)=>{
      this.rooms = data;
      })
  }
    
  ngAfterViewInit(){
    setTimeout(async () => {
      this.loadReady = true;
      this.modalReady = true; 
    }, 700);
    
   
  }
 
  next() {
    this.myCal.slideNext();
  }

  back() {
    this.myCal.slidePrev();
  }
 
  isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
  }

  markDisabled = (date: Date) => {
    var current = new Date();
    current.setDate(current.getDate()-1);
    return date < current;
  };

  onTimeSelected(ev) {    
    let eventDate= new Date(ev.selectedTime);
    this.day = eventDate.getDate();
    this.month = eventDate.getMonth();
    this.year =eventDate.getFullYear();
  }

  save() { 
   
    //fazer um if pra ver se os valores estão vazios 
    let i=0;
    let auxEvent=0; 
    let today = new Date();
    //verifico se as informações estão vazias ou se o horário de inicio é maior que o horário final
    if((this.event.title=='')||(this.event.room==null)||(this.event.room==undefined)){
      this.alertService.presentToast('Existem campos obrigatórios não preenchidos!');
     /* setTimeout(async () => {
        this.close(); 
      }, 1000); */
    }
    
    else if((this.event.endTime<this.event.startTime)||(this.event.startTime==this.event.endTime)){
      this.alertService.presentToast('Favor conferir os campos informados!');
    }
    else{

    //crio o formato new date setando os valores de data, segundo e milisegundo
    this.event.startTime= new Date(this.event.startTime);
    this.event.endTime= new Date(this.event.endTime);
    this.event.startTime.setDate(this.day);
    this.event.endTime.setDate(this.day);
    this.event.startTime.setMonth(this.month);
    this.event.endTime.setMonth(this.month);
    this.event.startTime.setFullYear(this.year);
    this.event.endTime.setFullYear(this.year);
    this.event.startTime.setSeconds(0);
    this.event.startTime.setMilliseconds(0);
    this.event.endTime.setSeconds(0);
    this.event.endTime.setMilliseconds(0);
    
    //verifico se não existe horário marcado naquela sala
    
    if((this.event.startTime.getUTCDate()==today.getUTCDate())&&(this.event.startTime.getUTCMonth()==today.getUTCMonth())&&(this.event.startTime.getUTCFullYear()==today.getUTCFullYear())&&((this.event.startTime.getUTCHours()< today.getUTCHours())||(this.event.startTime.getUTCHours()==today.getUTCHours()))&&(this.event.startTime.getUTCMinutes()<today.getUTCMinutes())){
      this.alertService.presentToast('Confira a hora informada!')
    }
    else{
      this.eventService.getEventsByRoomAPI(this.event.room).subscribe( (data:Array<any>)=>{
      if(this.isEmpty(data)){
        this.event.startTime = new Date(this.event.startTime);
        this.event.endTime = new Date(this.event.endTime);
        this.modalCtrl.dismiss({event: this.event}) 
      }
      else{
        this.event.startTime = new Date(this.event.startTime);
        this.event.endTime = new Date(this.event.endTime);
        for(i=0; i<data.length; i++){
          this.startTime= new Date(data[i].startTime.replace(/-/g, "/"));
          this.endTime= new Date(data[i].endTime.replace(/-/g, "/"));
          if((((this.event.startTime > this.endTime))||((this.event.startTime <  this.startTime)&&(this.event.endTime <= this.startTime))||((this.event.startTime >= this.endTime)))){ 
            auxEvent=auxEvent+1;
          }
          else{
            i++;
          }
        }
          if((auxEvent==data.length)||(auxEvent>data.length)){
            this.modalCtrl.dismiss({event: this.event}) 
          }
          else{
            this.alertService.presentToast('Este horário está ocupado na sala selecionada!');
          }
          
        }  
      })
    }
   }
  }
 
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
 
  
  close() {
    this.event.title= '';
    this.event.startTime= null;
    this.event.endTime= null;
    this.event.room=0;
    this.modalCtrl.dismiss();
  }
}