import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {EnvService} from '../env/env.service';
import {Router} from '@angular/router';
import {Md5} from 'ts-md5/dist/md5.js';
import {NativeStorage} from '@ionic-native/native-storage/ngx';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    isLoggedIn = true;
    token: any;
    user: any;
    companies: any;
    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(
        private http: HttpClient,
        private storage: NativeStorage,
        private env: EnvService,
        private router: Router
    ) {}

    getCompanies() {
        return this.http
            .get(this.env.API_URL + 'company/all', this.httpOptions)
            .toPromise()
            .then((companies) => {
                console.log('companies ', companies)
                this.companies = companies;
                return companies;
            })
            .catch((err) => console.log('erro ', err));
    }

    testConnectionAPI() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        return this.http
            .get(this.env.API_URL, httpOptions)
            .toPromise();
    }

    login(user) {
        return this.http
            .post(this.env.API_URL + 'login/', JSON.stringify({
                email: user.email,
                password: Md5.hashStr(user.password),
                company_id: user.company_id
            }), this.httpOptions)
            .pipe(
                tap((token:any) => {
                    this.storage.setItem('token', token)
                        .then(
                            () => {
                            },
                            error => console.error('Error storing token', error)
                        );
                        
                    this.storage.setItem('user', user)
                        .then(
                            () => {
                            },
                            error => console.error('Error storing user', error)
                        );
                    this.token = token;
                    this.user = user;
                    this.isLoggedIn = true;
                    return token;
                }),
            );
    }

    logout() {
        this.storage.remove("token");
        this.storage.remove("user");
        this.isLoggedIn = false;
        this.token = '';
        this.user = '';
        this.router.navigate(['/login']);
    }

    async getAuth() {
        await this.getToken();
        await this.getUser();
    }

    private async getToken() {
        return this.storage.getItem('token')
            .then(data => {
                this.token = data;
                if (this.token != null) {
                    this.isLoggedIn = true;
                } else {
                    this.isLoggedIn = false;
                }
            })
            .catch((error) => {
                this.token = null;
                this.isLoggedIn = false;
            });
    }

    private async getUser() {
        return this.storage.getItem('user')
            .then(data => {
                this.user = data;
            })
            .catch((error) => {
                this.user = null;
            });
    }
}
