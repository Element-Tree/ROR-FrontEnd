import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Device } from '@capacitor/device';
import { ThemeService } from 'src/app/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  validateForm!: UntypedFormGroup;
  imageUrl: SafeUrl | null = null;
  resStatus = '';
  resMessage = '';
  companyName?: any;
  passwordVisible = false;
  isDarkTheme!: boolean;
  private themeSubscription!: Subscription;
  isValidToken!: boolean;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private themeService: ThemeService
  ) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [''],
    });
  }

  login(): void {
    if (this.validateForm.valid) {
      try {
        this.authService
          .login(this.validateForm.value, this.companyName)
          .subscribe({
            next: async (res: any) => {
              console.log(res);
              if (res.success === true) {
                // const info = await Device.getInfo();
                // this.resMessage = JSON.stringify(info);
                localStorage.setItem('IsLoggedIn', 'true');
                let roleFromToken = await this.authService.getRoleFromTOken();
                let role = roleFromToken;
                console.log(role);
                if (role === 'ror-user') {
                  this.router.navigate([`user/dashboard`]);
                }

                if (role === undefined) {
                }
              } else {
                this.resStatus = res.success.toString();
                this.resMessage = res.message;
              }
              this.validateForm.reset();
            },
            error: (Error) => {
              alert('Login Failed');

              this.resStatus = Error.message.toString();
              this.resMessage = Error.message;

              console.log(this.resStatus);
              console.log(this.resMessage);
              console.log(Error);
            },
          });
      } catch (err) {
        alert('Login Failed');
        alert(err);
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  savedOBJ: any;
  async autoLogin() {
    const isLoggedIn = localStorage.getItem('IsLoggedIn');
    this.savedOBJ = await localStorage.getItem('_Remember_me');
    const parsedOBJ = JSON.parse(this.savedOBJ);
    if (parsedOBJ) {
      console.log('parsedOBJ', parsedOBJ);
      this.validateForm.get('email')?.setValue(parsedOBJ.email);
      this.validateForm.get('password')?.setValue(parsedOBJ.password);
      this.validateForm.get('remember')?.setValue(parsedOBJ.remember);
      if (isLoggedIn === 'true' && this.savedOBJ.remember === 'true') {
        this.authService
          .login(this.validateForm.value, this.companyName)
          .subscribe(async (res: any) => {
            console.log(res);
            if (res.success === true) {
              localStorage.setItem('IsLoggedIn', 'true');
              let roleFromToken = await this.authService.getRoleFromTOken();
              let role = roleFromToken;
              console.log(role);
              if (role === 'ror-user') {
                this.router.navigate([`user/dashboard`]);
              }

              if (role === undefined) {
              }
            } else {
              this.resStatus = res.success.toString();
              this.resMessage = res.message;
            }
          });
      }
    }

    this.validateForm.get('email')?.setValue(parsedOBJ.email);
    this.validateForm.get('password')?.setValue(parsedOBJ.password);
  }

  async redirectAccToRole(): Promise<void> {
    let roleFromToken = await this.authService.getRoleFromTOken();
    if (roleFromToken === 'ror-user') {
      this.router.navigate([`user/course-details`]);
    }
  }

  goToForgotPassword() {
    this.router.navigate([`auth/forgotpassword/${this.companyName}`]);
    this.imageUrl = 'assets/images/Logo with Name to right - Full Colour.png';
  }

  async ngOnInit(): Promise<void> {
    const currentTheme = this.themeService.getSavedTheme();
    this.themeSubscription = this.themeService
      .isDarkThemeObservable()
      .subscribe((isDark: boolean) => {
        this.isDarkTheme = isDark;
      });
    this.autoLogin();

    this.isValidToken = await this.authService.validateToken();
    if (this.isValidToken) {
      this.redirectAccToRole();
    }
  }
}
