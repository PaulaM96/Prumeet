import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EventRecordService } from 'src/app/services/event-record/event-record.service';
import { RoomService } from 'src/app/services/room/room.service';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  companies: any;
  ionicForm: FormGroup;
  isSubmitted = false;
 
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private roomService: RoomService,
    private eventService: EventRecordService,
  ) {}

  get errorControl() {
    return this.ionicForm.controls;
  }
 
  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      company_id: ['', [Validators.required]],
    });
    this.authService.getCompanies().then(data => {
        this.companies = data;
    });
  }
 
  login() {
    this.authService.testConnectionAPI()
        .then(async (c) => {
            this.isSubmitted = true;
            if (!this.ionicForm.valid) {
                return false;
            }
            const loading = await this.loadingController.create({
                message: 'Por favor, aguarde...'
            });
            this.authService.login(this.ionicForm.value).subscribe(
                async data => {
                    loading.present();
                    this.alertService.presentToast('Usuario Autenticado');
                    loading.dismiss();

                    //baixando salas de reunião
                    this.roomService.saveRoomsBd();
                    this.eventService.saveEventsBd();

                    this.navCtrl.navigateRoot('/calendario');
                },
                error => {
                    loading.dismiss();
                    this.alertService.presentToast(error.error.message);
                    console.error(error);
                },
                () => {}
            );
        })
        .catch((error) => {
            this.alertService.presentToast('Falha na conexão com a internet');
            console.log('error connection ', error);
        });
  }
}