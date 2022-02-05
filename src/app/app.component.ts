import { Component } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { DatabaseService } from './services/database/database.service';
import { RoomService } from './services/room/room.service';
import { AuthService } from './services/auth/auth.service';
import { AlertService } from './services/alert/alert.service';
import { EventRecordService } from './services/event-record/event-record.service';
import { StatusBar} from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  
  constructor(
    private roomService : RoomService,   
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private database: DatabaseService,
    private authService: AuthService,
    private alertService: AlertService,
    private navCtrl: NavController,
    private eventService: EventRecordService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.statusBar.backgroundColorByHexString('#dd5e14'); 
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.database.createDatabase()
      .then(data => {
        this.authService.getAuth()
                        .then(r => {
                                if (this.authService.isLoggedIn) {
                                    this.authService.testConnectionAPI()
                                        .then(async (c) => {
                                            this.database.dropRowsTables()
                                                .then((d) => {
                                                    this.getData();
                                                });
                                            this.navCtrl.navigateRoot(['/calendario']);
                                        })
                                        .catch((error) => {
                                            this.navCtrl.navigateRoot(['/calendario']);
                                            this.splashScreen.hide();
                                            this.alertService.presentToast('Falha na conexão com a internet');
                                        });
                                } else {
                                    this.splashScreen.hide();
                                }
                            }
                        );
                });
      })
    };

  getData() {
    return this.authService.testConnectionAPI()
        .then((data) => {
            return new Promise(async (resolve, reject) => {
                await this.roomService.saveRoomsBd();
                //await this.eventService.saveEventsBd();
                resolve(this.splashScreen.hide());
            });
        })
        .catch((error) => {
            this.alertService.presentToast('Falha na conexão com a internet');
        });
}


}
