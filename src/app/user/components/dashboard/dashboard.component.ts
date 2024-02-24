import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(private router: Router) {}
  Course() {
    this.router.navigate([`user/course-details`]);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
