import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import { delay, tap } from 'rxjs/operators';
import { Room } from 'src/app/models/room';
import { AlertService } from '../alert/alert.service';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/database.service';
import { EnvService } from '../env/env.service';
import { Observable ,throwError } from 'rxjs';
import { from } from 'rxjs';
import { R3ExpressionFactoryMetadata } from '@angular/compiler/src/render3/r3_factory';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  //private room: Room[];
  //private rooms: Room[];
  private result: [];
  constructor(
    private http: HttpClient,
    private env: EnvService,
    private authService:AuthService,
    private databaseService: DatabaseService,
    private alertService:AlertService, //nao sei se precisa
    

    ) { }

  // recupera as salas da web
    getRoomsAPI() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': this.authService.token['token_type'] + ' ' + this.authService.token['access_token']
            })
        };
        return this.http
            .get(this.env.API_URL+ 'rooms', httpOptions)
            .pipe(
                tap(rooms => {
                    return rooms;
                }),
            );
    }

// salva um vetor de salas
    saveRoomsBd() {
        return this.getRoomsAPI().subscribe(
            (data: any) => {
                return this.insert(data)
                    .then((e) => {
                        return e;
                    });
                },
                error => {
                    //this.alertService.presentToast(error.error.message);
                    console.error('Erro ao baixar salas: ' + error);
                },
                () => {
                }
            );
        }

    // insere uma sala no banco
    public insert(room: Array<Room>) {
        return this.databaseService.getDB()
            .then((db: SQLiteObject) => {
                let sql = 'insert or ignore into rooms (name, description) values ';
                var data = [];
                var rowArgs = [];
                room.forEach(function(room) {
                    rowArgs.push('(?, ?)');
                    data.push(room.name);
                    data.push(room.description);
                });
            sql += rowArgs.join(', ');
        
            return db.executeSql(sql, data)
            .then(() => {
                return true;
            })
            .catch((e) => console.error(e));
            })
        .catch((e) => console.error(e));
    }

    // Retrieve rows from table método paula dando pau
   /* getRows = (): Promise<any> => new Promise ((resolve,reject)=> { 
    {
       this.databaseService.getDB()
            .then(async (db: SQLiteObject) => {
                const sql = 'SELECT * FROM rooms';
                console.log('Entrei no GetROWS dps do select'); 
                 
                db.executeSql(sql, [])
                    .then((res) => {
                        const rowData = [];
                        
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                rowData.push(res.rows.item(i));
                            }
                        }
                        resolve({ return: rowData })

                        //return(rowData);
                        
                    })
                    
                    .catch((e) => console.error(e));
            })
            .catch((e) => console.error(e))
    }
    }) */


//metodo duda
public getRows() {
       return this.databaseService.getDB()
            .then( (db: SQLiteObject) => {
                const sql = 'SELECT * FROM rooms';
                
            return db.executeSql(sql, [])
                    .then((res) => {
                        const rowData = [];
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                rowData.push(res.rows.item(i));
                            }
                        }
                        console.log('GETROWS',rowData)
                        return rowData;
                    })
                    .catch((e) => console.error(e));
            })
            .catch((e) => console.error(e));
    }
    

    public getRoomsMethod = (): Promise<any> => new Promise ((resolve,reject)=> {
         this.databaseService.getDB()
        .then(async (db: SQLiteObject) => {
            const sql = 'Select *from rooms'; 
            const result = await db.executeSql(sql); 
            const rooms = this.fillRooms(result.rows); 
            console.log('rooms dentro do get Rooms',rooms)
            resolve({ return: Object.values(rooms)})
        })
        .catch((e) => console.error(e)); 
    }
) 

    private fillRooms(rows:any) { 
        const rooms: Room[]=[]; 
        for (let i=0; i< rows.length; i++){ 
            const item= rows.item(i); 
            const room= new Room(); 
            room.id = item.id; 
            room.name= item.name; 
            room.description=item.description; 
            rooms.push(room);
        } 
        console.log('rooms dentro do fill rooms',rooms)
        return rooms;
    }
     

    /*getRooms(page?: number, size?: number): Room[] {
        if (page && size) {
          return this.room.slice((page - 1) * size, ((page - 1) * size) + size);
        }else {
          return this.room;
        }
      }
    
      getRoomsAsync(page?: number, size?: number, timeout = 2000): Observable<Room[]> {
        return new Observable<Room[]>(observer => {
          observer.next(this.getRooms(page, size));
          observer.complete();
        }).pipe(delay(timeout));
      }*/
}

