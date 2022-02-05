import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
//import { Platform } from '@ionic/angular';
import { BehaviorSubject, from, of } from 'rxjs';
//mport { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  dbReady = new BehaviorSubject(false);
  constructor(
    private sqlite: SQLite,
  ) { }

    /**
     * Cria um banco caso não exista ou pega um banco existente com o nome no parametro
     */

    public openDataBase(){

    }
    public getDB() {
      return this.sqlite.create({
          name: 'reunion.db',
          location: 'default'
      });
    }
  /**
  * Cria a estrutura inicial do banco de dados
  */
  public createDatabase() {
    return this.getDB()
      .then(async (db: SQLiteObject) => {
      // Criando as tabelas
      await this.createTableRoom(db);
      await this.createTableEvents(db);
      return true;
    })
    .catch(e => console.log(e));
  }

  /**
  * Criando a tabela rooms no banco de dados
  */
  private createTableRoom(db: SQLiteObject) {
    // Criando a tabela
    return db.executeSql('CREATE TABLE IF NOT EXISTS rooms (' +
    'id integer primary key AUTOINCREMENT NOT NULL, ' +
    'name TEXT NOT NULL UNIQUE, ' +
    'description TEXT NULL)', [])
    .then()
    .catch(e => console.error('Erro ao criar tabela rooms', e));
    }

  private createTableEvents(db:SQLiteObject){
    //Criando a tabela de eventos
    return db.executeSql('CREATE TABLE IF NOT EXISTS events (' +
    'id integer primary key AUTOINCREMENT NOT NULL, ' +
    'title TEXT NOT NULL, ' +
    'description TEXT NOT NULL,' +
    'startTime TEXT NOT NULL,' +
    'endTime TEXT NOT NULL,' +
    'room INTEGER NOT NULL)', [])
    .then()
    .catch(e => console.error('Erro ao criar tabela events', e));
  }

  dropRowsTables() {
    return this.getDB()
        .then(async (db: SQLiteObject) => {
            await db.executeSql('delete from events', [])
                .then()
                .catch(e => console.error('Erro ao deletar tabela Events', e));
            return true;
        })
        .catch((error) => {
            console.log('error ', error);
        });
}
}
