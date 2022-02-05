import {Injectable} from '@angular/core';
import {Event} from '../../models/event';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnvService} from '../env/env.service';
import {AuthService} from '../auth/auth.service';
import {DatabaseService} from '../database/database.service';
import {SQLiteObject} from '@ionic-native/sqlite';
import {AlertService} from '../alert/alert.service';
import {NavController} from '@ionic/angular';
import { tap, map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EventRecordService {

    events :any;
    event: any;
    constructor(
        private http: HttpClient,
        private envService: EnvService,
        private authService: AuthService,
        private databaseService: DatabaseService,
        private alertService: AlertService,
        private navCtrl: NavController,
    ) {
    }

    // não entendi kk
    createAPI(events) {

        var date = new Date(events.startTime);
        events.startTime= new Date(date.getTime() - date.getTimezoneOffset() * 60000);

        var date2 = new Date(events.endTime);
        events.endTime= new Date(date2.getTime() - date2.getTimezoneOffset() * 60000);

        console.log('Dentro do Insert API',events);

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.authService.token['token_type'] + ' ' + this.authService.token['access_token']
        });
        return this.http
            .post(this.envService.API_URL + 'events', JSON.stringify(events), {headers: headers})
            .toPromise()
    }

    public insert(event : Event) {
        event.startTime= new Date(event.startTime);
        event.endTime= new Date(event.endTime);
        console.log('Evento dentro do insert',event)
        return this.databaseService.getDB()
            .then((db: SQLiteObject) => {
                const sql = 'insert into events (' +
                    'title, ' +
                    'description, ' +
                    'startTime,' +
                    'endTime,' +
                    'room) ' +
                    'values (?, ?, ?, ?, ?)';
                const data = [
                    event.title,
                    event.description,
                    event.startTime,
                    event.endTime,
                    event.room
                ];

                return db.executeSql(sql, data)
                    .then(() => {
                        //criar new date se necessário
                        this.alertService.presentToast('Registrado com sucesso');
                        this.navCtrl.navigateRoot('/calendario');
                        return true;
                    })
                    .catch((e) => console.error(e));
            })
            .catch((e) => console.error(e));
    }

    getEventsAPI() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': this.authService.token['token_type'] + ' ' + this.authService.token['access_token']
            })
        };
        
        return this.http
            .get(this.envService.API_URL+ 'events', httpOptions)
            .pipe(
                tap(events => {
                    this.events= events;
                    return events;
                }),
            );
    }

    getEventsByRoomAPI(id : number) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': this.authService.token['token_type'] + ' ' + this.authService.token['access_token']
            })
        };
        return this.http
            .get(this.envService.API_URL+ 'events-by-room/'+ id, httpOptions)
            .pipe(
                tap(events => {
                    return events;
                }),
            );
    }

    getEventsByUser(){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': this.authService.token['token_type'] + ' ' + this.authService.token['access_token']
            })
        };
        return this.http
            .get(this.envService.API_URL+ 'events-by-user/', httpOptions)
            .pipe(
                map(events => {
                    return events;
                }),
            );
    }

    update(event : Event,id : number) {
        
        console.log("Evento dentro do update",event)
        var date = new Date(event.startTime);
        event.startTime= new Date(date.getTime() - date.getTimezoneOffset() * 60000);

        var date2 = new Date(event.endTime);
        event.endTime= new Date(date2.getTime() - date2.getTimezoneOffset() * 60000);

        

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.authService.token['token_type'] + ' ' + this.authService.token['access_token']
        });
        return this.http
            .put(this.envService.API_URL + 'events/' + id, JSON.stringify(event), {headers: headers})
            .toPromise()
    }
    
    public delete(id: number) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.authService.token['token_type'] + ' ' + this.authService.token['access_token']
        });
        return this.http
            .delete(this.envService.API_URL + 'events/' + id, {headers:headers})
            .pipe(map((data: any) => data))
    }

    // Retrieve rows from table
    public getRows() {
        return this.databaseService.getDB()
            .then((db: SQLiteObject) => {
                const sql = 'SELECT * FROM events';

                return db.executeSql(sql, [])
                    .then((res) => {
                        const rowData = [];
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                rowData.push(res.rows.item(i)); 
                            }
                        }
                        return rowData;
                    })
                    .catch((e) => console.error(e));
            })
            .catch((e) => console.error(e));
    }


    public getRowsByRoom(room:number) {
        return this.databaseService.getDB()
            .then((db: SQLiteObject) => {
                const sql = 'SELECT * FROM events WHERE (room = @roomID)';
                return db.executeSql(sql, [room])
                    .then((res) => {
                        const rowData = [];
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                rowData.push(res.rows.item(i)); 
                            }
                        }
                        return rowData;
                    })
                    .catch((e) => console.error(e));
            })
            .catch((e) => console.error(e));
    }

  
    // Apagar registros da tabela
    async deleteRows() {
        return await this.databaseService.getDB()
            .then(async (db: SQLiteObject) => {
                const sql = 'DELETE FROM events';

                return await db.executeSql(sql, [])
                    .then((res) => {
                        return true;
                    })
                    .catch((e) => console.error(e));
            })
            .catch((e) => console.error(e));
    }
    saveEventsBd() {
        return this.getEventsAPI().subscribe(
            (data: any) => {
                if(data==null){
                    return;
                }
                else{
                    return this.insert(data)
                        .then((e) => {
                            return e;
                        });
                }
                },
                error => {
                    //this.alertService.presentToast(error.error.message);
                    console.error('Erro ao baixar eventos: ' + error);
                },
                () => {
                }
            );
        }
}
