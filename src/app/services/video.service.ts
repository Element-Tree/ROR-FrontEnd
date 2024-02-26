import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private rewatchVideoSubject = new Subject<void>();

  rewatchVideo$ = this.rewatchVideoSubject.asObservable();

  rewatchVideo() {
    this.rewatchVideoSubject.next();
  }
}
