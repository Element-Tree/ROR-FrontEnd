import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';

const BACKEND_URL: any = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private role$ = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) { }
  createUsers(data: any) {
    return this.http.post(BACKEND_URL + '/users/comapny-users', data);
  }

  public getRoleFromStore() {
    return this.role$.asObservable();
  }
}
