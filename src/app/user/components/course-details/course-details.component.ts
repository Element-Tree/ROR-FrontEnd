import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { VgApiService } from '@videogular/ngx-videogular/core';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class CourseDetailsComponent {
  isHovered = false;
  private inactivityTimer: any; // Timer to track inactivity

  // Add a property to store the original video source
  originalVideoSrc = 'assets/videos/video1.mp4';

  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<any>;
  currentVideoTime!: any;

  constructor(private api: VgApiService) {}
  // Function to handle mouse enter event
  onMouseEnter() {
    this.isHovered = true;
    this.resetInactivityTimer();
  }

  // Function to handle mouse leave event
  onMouseLeave() {
    this.isHovered = false;
    this.resetInactivityTimer();
  }

  // Function to reset the inactivity timer
  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);

    // Set a timeout to hide controls after 4 seconds of inactivity
    this.inactivityTimer = setTimeout(() => {
      this.isHovered = false;
    }, 3000);
  }

  // Listen to mousemove event to reset hover state
  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    this.onMouseEnter();
  }

  // Listen to video player events to reset inactivity timer
  ngAfterViewInit() {
    this.videoPlayer.nativeElement.addEventListener('click', () => {
      this.resetInactivityTimer();
    });

    // Add other events you want to listen for, e.g., play, pause, etc.
  }

  // Function to handle zoom in
  isZoomin = true;
  isZoomout = false;
  isgoback = false;
  isradarvisible = false;
  zoomIn() {
    this.isZoomin = false;
    this.isZoomout = true;
    this.isgoback = false;

    // Change the video source to the new video
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentVideoTime = videoElement.currentTime;

    videoElement.src = 'assets/videos/video2.mp4';
    videoElement.load(); // Load the new video

    // Use 'loadeddata' event to ensure metadata is loaded before setting currentTime
    videoElement.addEventListener('loadeddata', () => {
      videoElement.currentTime = 0; // Start playing from the beginning
      videoElement.play(); // Start playing the new video
    });
  }

  // Function to handle zoom out
  zoomOut() {
    this.isZoomin = true;
    this.isZoomout = false;
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;

    // Change the video source back to the original video
    videoElement.src = this.originalVideoSrc;
    videoElement.load(); // Load the original video

    // Use 'loadeddata' event to ensure metadata is loaded before setting currentTime
    videoElement.addEventListener('loadeddata', () => {
      videoElement.currentTime = this.currentVideoTime;
      videoElement.play(); // Start playing from the stored currentTime
    });
  }
  goback() {
    this.isZoomin = true;
    this.isZoomout = false;
    this.isgoback = false;
    this.isradarvisible = false;

    setTimeout(async () => {
      const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;

      // Change the video source back to the original video
      videoElement.src = this.originalVideoSrc;
      videoElement.load(); // Load the original video
      // Use 'loadeddata' event to ensure metadata is loaded before setting currentTime
      videoElement.addEventListener('loadeddata', () => {
        videoElement.currentTime = this.currentVideoTime;
        videoElement.play(); // Start playing from the stored currentTime
      });
    }, 100);
  }
  Leftvideo() {
    this.isZoomin = false;
    this.isZoomout = false;
    this.isgoback = true;

    // Change the video source to the new video
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentVideoTime = videoElement.currentTime;

    videoElement.src = 'assets/videos/video3.mp4';
    videoElement.load(); // Load the new video

    // Use 'loadeddata' event to ensure metadata is loaded before setting currentTime
    videoElement.addEventListener('loadeddata', () => {
      videoElement.currentTime = 0; // Start playing from the beginning
      videoElement.play(); // Start playing the new video
    });
  }
  rightvideo() {}
  Radar() {
    this.isZoomin = false;
    this.isZoomout = false;

    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentVideoTime = videoElement.currentTime;

    videoElement.src = 'assets/videos/video2.mp4';
    videoElement.load(); // Load the new video

    // Use 'loadeddata' event to ensure metadata is loaded before setting currentTime
    this.isgoback = true;
    this.isradarvisible = true;
  }
  objective() {}
  showVideo: Boolean = true;
  showRewatchandAssessment: boolean = false;

  onPlayerReady(source: VgApiService) {
    this.api = source;
    console.log('onPlayerReady');

    this.api.getDefaultMedia().subscriptions.ended.subscribe(() => {
      this.showVideo = false;
      this.showRewatchandAssessment = true;
    });
  }
  rewatchVideo() {
    this.showVideo = true;
    this.showRewatchandAssessment = false;
  }
  StartAssesment() {}

  getVideoProgress() {
    const videoElement = this.videoPlayer.nativeElement;
    const currentTime = videoElement.currentTime;
    const duration = videoElement.duration;

    if (!isNaN(duration)) {
      const progressPercentage = (currentTime / duration) * 100;
      console.log(
        'Current Video Progress:',
        progressPercentage.toFixed() + '%'
      );
    }
  }
}
