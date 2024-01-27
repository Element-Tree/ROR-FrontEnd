import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { UserRoutingModule } from './user-routing.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

@NgModule({
  declarations: [UserComponent, CourseDetailsComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NzLayoutModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
})
export class UserModule {}
