import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { map, pipe, tap } from 'rxjs';
import * as moment from 'moment';

const BACKEND_URL: any = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userPayload: any;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(data: any, companyName: any) {
    return this.http.post(BACKEND_URL + `/users/login`, data).pipe(
      tap(async (res: any) => {
        if (data.remember === true) {
          localStorage.setItem('_Remember_me', JSON.stringify(data));
          this.cookieService.set('_Remember_me', JSON.stringify(data));
        }
        console.log(res.token);
        this.setSession(res);
      })
    );
  }

  private async setSession(authResult: any) {
    const expiresAt = moment().add(authResult.sessionExpireIn, 'second');
    if (authResult.success !== true) {
      this.userPayload = '';
      return;
    }
    const expirydate = new Date();
    expirydate.setDate(expirydate.getDate() + 15);
    await this.cookieService.set(
      'jwt',
      authResult.token,
      expirydate,
      '/',
      '',
      false,
      'Lax'
    );
    localStorage.setItem('jwt', authResult.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    this.userPayload = await this.decodedToken();
    // sessionStorage.setItem('name', this.userPayload.name);
  }

  getToken() {
    const token = localStorage.getItem('jwt');
    return token;
  }

  decodedToken() {
    const token = this.getToken()!;
    console.log(token);
    const jwtHelper = new JwtHelperService();
    const value = token;
    const decodeToken = JSON.stringify(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token);
  }

  async getRoleFromTOken() {
    this.userPayload = await this.decodedToken();
    return this.userPayload.role;
  }

  async getNameFromTOken() {
    this.userPayload = await this.decodedToken();
    return this.userPayload.username;
  }

  async getIdFromToken() {
    this.userPayload = await this.decodedToken();
    return this.userPayload.id;
  }
}
