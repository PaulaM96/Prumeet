import { ThrowStmt } from '@angular/compiler';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import { ignoreElements } from 'rxjs/operators';
import { Event } from 'src/app/models/event';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EventRecordService } from 'src/app/services/event-record/event-record.service';
import { RoomService } from 'src/app/services/room/room.service';
import { MyEventsPage } from '../my-events/my-events.page';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {

  @Input() idEvent :number;
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
  evento = new Event();
  events = [];
  id:number;
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  modalReady = false;
  loadReady = false;
  currentDateSelected=false;
  roomId:number;

  
 
  constructor(
    private modalCtrl: ModalController,
    private roomService: RoomService,
    private cdr: ChangeDetectorRef,
    private eventService: EventRecordService,
    private myEvents: MyEventsPage,
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
    this.id = this.idEvent;
    
    this.eventService.getEventsByUser().subscribe((data:Array<any>)=>{
      let i = 0;
      for(i=0; i<data.length; i++){
        if(data[i].id == this.id){
          this.event.title= data[i].title;
          this.event.description= data[i].description;
          this.event.startTime = data[i].startTime;
          this.event.endTime = data[i].endTime;
          this.event.room= data[i].room;
          this.event.id=data[i].id;
          this.roomId=data[i].room.id;
          this.evento = data[i];
        }
      }
    });
    
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

    if((this.evento.startTime==this.event.startTime)&&(this.evento.endTime==this.event.endTime)&&(this.evento.room==this.event.room)){

      this.event.startTime= new Date(this.event.startTime);
      this.event.endTime= new Date(this.event.endTime);
      this.event.room=this.roomId;
      this.modalCtrl.dismiss({event: this.event});

    }

    this.event.startTime= new Date(this.event.startTime);
    this.event.endTime= new Date(this.event.endTime);
    this.evento.startTime= new Date(this.evento.startTime);
    this.evento.endTime= new Date(this.evento.endTime);

    if((this.evento.startTime.getHours()==this.event.startTime.getHours())&&(this.evento.startTime.getMinutes()==this.event.startTime.getMinutes())){
      
      this.event.startTime.setDate(this.day);
      this.event.startTime.setMonth(this.month);
      this.event.startTime.setFullYear(this.year);
      this.event.startTime.setSeconds(0);
      this.event.startTime.setMilliseconds(0); 
    }

    if((this.evento.endTime.getHours()==this.event.endTime.getHours())&&(this.evento.endTime.getMinutes()==this.event.endTime.getMinutes())){
      
      this.event.endTime.setDate(this.day);
      this.event.endTime.setMonth(this.month);
      this.event.endTime.setFullYear(this.year);
      this.event.endTime.setSeconds(0);
      this.event.endTime.setMilliseconds(0); 
    }
    
    if(this.evento.room==this.event.room){
      this.event.room=this.roomId;
    }
    else{
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
    }
   
    //fazer um if pra ver se os valores estão vazios 
    let i=0;
    let auxEvent=0; 
    let today = new Date();
    //verifico se as informações estão vazias ou se o horário de inicio é maior que o horário final
    if(this.event.endTime<this.event.startTime){
      this.alertService.presentToast('Favor conferir os campos informados');
    }
    
    else{

    this.event.startTime= new Date(this.event.startTime);
    this.event.endTime= new Date(this.event.endTime);
    
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
          for(i=0; i<data.length; i++){
            
            this.startTime= new Date(data[i].startTime);
            this.endTime= new Date(data[i].endTime);
      
            if((((this.event.startTime > this.endTime))||((this.event.startTime <  this.startTime)&&(this.event.endTime <= this.startTime))||((this.event.startTime >= this.endTime)))){ 
              
              auxEvent=auxEvent+1;

            }
            else{
              if(this.event.id==data[i].id){
                auxEvent=auxEvent+1;
              }
              else{
                i++;
              }
            }
          }
            
            if((auxEvent==data.length)||(auxEvent>data.length)){
              this.event.startTime = new Date(this.event.startTime);
              this.event.endTime = new Date(this.event.endTime);
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
