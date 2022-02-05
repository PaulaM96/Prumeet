import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  //API_URL = 'http://192.168.1.194:8000/api/';
  API_URL = 'http://ponto.celulaweb.com.br/api/';
  //API_URL = 'http://ponto.celulaweb.com.br/api/';
  //API_JSON = 'http://192.168.1.13:3000/';
  constructor() { }
}
