import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MediaService } from 'src/app/services/media.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';

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

  private themeSubscription!: Subscription;
    isDarkTheme!: boolean;
  videoArray = [
    {
      src: 'assets/videos/video1.mp4',
      videotitle: 'Video 1',
      index: 1,
      zoomvideo: 'assets/videos/zoom1.mp4',
      progress: 0,
      progressPercentage: 0,
      isDisabled: false,
      isAssessmentCompleted: false,
    },
    {
      src: 'assets/videos/video2.mp4',
      videotitle: 'Video 2',
      index: 2,
      zoomvideo: 'assets/videos/zoom2.mp4',
      progress: 0,
      progressPercentage: 0,
      isDisabled: true,
      isAssessmentCompleted: false,
    },
    {
      src: 'assets/videos/video3.mp4',
      videotitle: 'Video 3',
      index: 3,
      zoomvideo: 'assets/videos/zoom3.mp4',
      progress: 0,
      progressPercentage: 0,
      isDisabled: true,
      isAssessmentCompleted: false,
    },
  ];

  currentVideoIndex: any; // Initial index

  isHovered = false;
  private inactivityTimer: any; // Timer to track inactivity
  userId: any;
  courseId: any;
  isVideoPlaying: boolean = false;

  // Add a property to store the original video source
  originalVideoSrc = 'assets/videos/video1.mp4';

  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<any>;
  currentVideoTime!: any;

  constructor(
    private api: VgApiService,
    private auth: AuthService,
    private mediaService: MediaService,
    private message: NzMessageService,
    private router: Router,
    private themeService: ThemeService
  ) {}
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

  // Function to handle zoom in
  isZoomin = true;
  isZoomout = false;
  isgoback = false;
  isradarvisible = false;

  loadVideo(videoData: any) {
    let videoSource: any;
    this.showRewatchandAssessment = false;
    this.showVideo = true;
    this.currentVideoIndex = videoData.index;
    videoSource = videoData.src;
    setTimeout(() => {
      const videoElement = this.videoPlayer.nativeElement;

      console.log(videoSource);
      videoElement.src = videoSource;
      videoElement.load();
      videoElement.addEventListener('loadeddata', () => {
        if (videoData.progressPercentage !== 100) {
          videoElement.currentTime = videoData.progress; // Start playing from the beginning
        }
        videoElement.play(); // Start playing the new video
      });

      // You can add other event listeners or actions here if needed
      videoElement.addEventListener('playing', () => {
        this.isVideoPlaying = true;
      });
    });
  }

  zoomIn() {
    this.isZoomin = false;
    this.isZoomout = true;
    this.isgoback = false;

    // Change the video source to the new video
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentVideoTime = videoElement.currentTime;
    const zoomVideoSource = this.videoArray[this.currentVideoIndex].zoomvideo;
    console.log('zoommvideo', zoomVideoSource);
    videoElement.src = zoomVideoSource;
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
    videoElement.src = this.videoArray[this.currentVideoIndex].src;

    // Change the video source back to the original video
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

    videoElement.src = 'assets/videos/left1.mp4';
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
      this.isVideoPlaying = false;
      this.showVideo = false;
      this.showRewatchandAssessment = true;
      this.isVideoPlaying = false;

      this.saveVideoProgress();
    });
  }

  saveVideoProgress() {
    const videoElement = this.videoPlayer.nativeElement;
    const currentTime = videoElement.currentTime;
    const duration = videoElement.duration;

    if (!isNaN(duration)) {
      const progressPercentage = ((currentTime / duration) * 100).toFixed();
      console.log('currentTime', currentTime);
      console.log('duration', duration);
      console.log(progressPercentage);

      const data = {
        userId: this.userId,
        courseId: 1,
        videoId: this.currentVideoIndex, // Adding 1 to convert from zero-based index
        progress: currentTime,
        videoDuration: duration,
        progressPercentage: progressPercentage,
      };

      console.log('Video Progress Data:', data);
      this.mediaService.saveVideoProgress(data).subscribe((res: any) => {
        const itemIndex = this.videoArray.findIndex(
          (item: any) => item.index === this.currentVideoIndex
        );

        console.log(itemIndex);
        if (itemIndex !== -1) {
          this.videoArray[itemIndex].progressPercentage =
            parseInt(progressPercentage);

          this.videoArray[itemIndex].isDisabled = false;
        }

        if (res.success === true) {
          this.message.success('Video Progress Saved Successfully!');
        }
      });

      // Now, you can use the 'data' object to save the progress to your backend or wherever needed.
    }
  }

  videoContent: any;
  onPageLoaded: Boolean = true;

  fetchvideoprogress() {
    this.mediaService
      .fetchVideoprogress(this.courseId, this.userId)
      .subscribe((res: any) => {
        console.log(res);

        // Add Progress to video Array
        this.videoArray.forEach((video) => {
          const matchingProgress = res.find(
            (item: any) => item.videoId === video.index
          );
          if (matchingProgress) {
            video.progress = matchingProgress.progress;
            video.progressPercentage = matchingProgress.progressPercentage;
            video.isAssessmentCompleted =
              matchingProgress.isAssessmentCompleted;
          }
        });

        // Should the Video be Disabled
        this.videoArray.map((item: any, index: any, array: any) => {
          if (item.index === 1) {
            item.isDisabled = false;
          } else {
            const previousItem = array[index - 1];
            if (
              previousItem.progressPercentage === 100 &&
              previousItem.isAssessmentCompleted
            ) {
              item.isDisabled = false;
            }
          }
        });

        //what should be be played :)
        if (this.onPageLoaded) {
          let itemFound = false; // Initialize a flag to track if an item is found
          this.videoArray.some((item: any, index: any) => {
            if (item.progressPercentage !== 100) {
              this.currentVideoIndex = item.index;
              this.loadVideo(item);
              itemFound = true;
              return true; // Exit the loop when an item is found
            } else if (
              item.progressPercentage === 100 &&
              !item.isAssessmentCompleted
            ) {
              this.currentVideoIndex = item.index;
              this.showRewatchandAssessment = true;
              this.showVideo = false;
              return true;
            } else {
              return false;
            }
          });
        }

        console.log('videoArray', this.videoArray);
      });
  }

  rewatchVideo() {
    this.showVideo = true;
    this.showRewatchandAssessment = false;
    this.isVideoPlaying = true;

    setTimeout(() => {
      const videoElement = this.videoPlayer.nativeElement;
      let videoSource;
      this.videoArray.map((item: any) => {
        if (this.currentVideoIndex === item.index) {
          videoSource = item.src;
        }
      });

      videoElement.src = videoSource;
      videoElement.load();
      videoElement.play();
    });
  }

  StartAssesment() {
    const encryptedCourseId = CryptoJS.AES.encrypt(
      this.currentVideoIndex.toString(),
      'encryptionKey'
    ).toString();
    this.router.navigate([`user/assesments`], {
      queryParams: { index: encryptedCourseId },
    });
  }

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

  playNextVideo() {
    this.showRewatchandAssessment = false;
    this.showVideo = true;
    setTimeout(() => {
      const videoElement = this.videoPlayer.nativeElement;

      if (this.currentVideoIndex < this.videoArray.length - 1) {
        this.currentVideoIndex++;
        videoElement.src = this.videoArray[this.currentVideoIndex].src;
        videoElement.load();
      } else {
        // Handle the case when there are no more videos
        console.log('No more videos');
      }
      videoElement.play();
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    // Your code here to handle the refresh event
    this.saveVideoProgress();
    $event.returnValue = null; // This line will display a confirmation dialog to the user
  }

  // Listen to video player events to reset inactivity timer
  ngAfterViewInit() {
    this.videoPlayer.nativeElement.addEventListener('click', () => {
      this.resetInactivityTimer();
    });

    // Add other events you want to listen for, e.g., play, pause, etc.
  }

  async ngOnInit(): Promise<void> {
    this.courseId = 1;
    this.userId = await this.auth.getIdFromToken();
    this.fetchvideoprogress();

    const currentTheme = this.themeService.getSavedTheme();
    this.themeSubscription = this.themeService
      .isDarkThemeObservable()
      .subscribe((isDark: boolean) => {
        this.isDarkTheme = isDark;
      });

    // this.loadVideo();
    console.log('userid', this.userId);
  }
}
