import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  constructor(
   
    private cookieService : CookieService,
    private router : Router,
    private auth: AuthService,) { }
  breadcrumbs: string[] = [];
  Username = '';
  isLoggedIn!: any;

  async logout() {
    await this.cookieService.get('%User%');
    await this.cookieService.deleteAll('%User%');
    localStorage.removeItem('expires_at');
    await this.cookieService.delete('_Remember_me');
    localStorage.removeItem('IsLoggedIn');
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }

  


  async ngOnInit() {
    this.Username = await this.auth.getNameFromTOken();
  }

}
