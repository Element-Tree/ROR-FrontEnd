import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  isDarkTheme!: boolean;
  private themeSubscription!: Subscription;
  constructor(private router: Router, private themeService: ThemeService) {}
  Course() {
    this.router.navigate([`user/course-details`]);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  async ngOnInit(): Promise<void> {
    const currentTheme = this.themeService.getSavedTheme();
    this.themeSubscription = this.themeService
      .isDarkThemeObservable()
      .subscribe((isDark: boolean) => {
        this.isDarkTheme = isDark;
      });
    }

  
}
