import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'et-assesments',
  templateUrl: './assesments.component.html',
  styleUrls: ['./assesments.component.css'],

})

export class AssesmentsComponent {
  [x: string]: any;
  assesmentData: any
  totalQuestions!: number
  radioValue = 'A';
  currentQuestionIndex = 0
  currentQuestion: any[] = []
  isAssesmentCompleted: boolean = false
  isAssesmentStarted: boolean = false
  AnswerArray: any[] = []
  selectedOptions: string[] = [];
  buttonSizeForm: FormGroup
  resultForm: FormGroup
  audioContext!: AudioContext;  
  audioBuffer!: AudioBuffer;
  answerStatus: any
  mcqValue = new FormControl({ });
  mcaValue = new FormControl({ });
  tfValue = new FormControl({ });
  blanksValue = new FormControl({ });


  groupedQuestions: Map<number, any[]> = new Map();
  isRatingVisible = false;
  isResultVisible = false;
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  ratingValue: number = 0; // Set the initial value here
  totalQuestion: any
  totalAttempts: any
  finalScore: any
  
  // wrongAnswer(type: string): void {
  //   this.message.success( `Incorrect Answer, Please Try Again`);
  // }
hello(){
  this.isResultVisible = true;

}


  timeOut(type: string): void {
    // this.message.create(type, `Countdown timer has run out.`);
    const modal = this.modal.warning({
      nzTitle: 'Countdown Timer has ran out',
      nzContent: `you have ${(this.attempt - 2)} attempt remaining` ,

      nzClosable: true,
      nzCentered: true,
      nzOkDisabled: true,
      nzOkText: null,
    });
    setTimeout(() => {modal.destroy()}, 2000);
  }

  
  navigateAway(type: string): void {
    // this.message.create(type, `Countdown timer has run out.`);
    const modal = this.modal.warning({
      nzTitle: 'Your attempt limit is exceeded',
      nzClosable: true,
      nzCentered: true,
      nzOkDisabled: true,
      nzOkText: null,
    });
    setTimeout(() => modal.destroy(), 2000);
  }
  
  isMessageShown: boolean = false;
  isWrongBefore: boolean = false;
  attempt: number = 4;
  TimeCounter:number = 60;
  timerStatus:any
  timerPercent:any
  feedValue: string | undefined;
  formatOne = (TimeCounter: number,): string => `${(TimeCounter / 1.65).toFixed(0)}`;
  constructor(private url: ActivatedRoute, private userService: UserService, private formBuilder: FormBuilder, private auth: AuthService, private cd: ChangeDetectorRef, private router: Router, private message: NzMessageService,    private modal: NzModalService,
    ) {
    this.buttonSizeForm = this.formBuilder.group({
      radioValue: new FormControl('', [Validators.required]),
      inputValue: new FormControl('', [Validators.required]),
      booleanValue: new FormControl('', [Validators.required]),
 
    });
    this.resultForm = this.formBuilder.group({
 
    });
    this.audioContext = new AudioContext();

  }

  async getAssesmentQuestions(Id: any) {
    await this.userService.getQuestsionByVideoId(Id).subscribe((res: any) => {
      if (res) {
        console.log("shuffled",res)
        this.totalQuestions = res.length
        this.assesmentData = res.map((element: any, index: any) => {
          return { ...element, index };
        });
        console.log(this.assesmentData)
        this.populateQuestionData()
      }
    })
  }

  populateQuestionData() {
    if (this.currentQuestionIndex < this.totalQuestions) {
      this.currentQuestion = this.assesmentData.filter((item: any) => {
        return item.index === this.currentQuestionIndex
      })
    }
  }
  responseArray!: any[]
  async onSubmit(data: any) {
    console.log("onSubmit ==>", data)
    await this.nextQuestion(data).then(async (res:any) => {
if (res){
  await this.stopTimer()
  this.isResultVisible = true;
  const userId = await this.auth.getIdFromToken()
  const Data = { id: this.id, Ans: this.AnswerArray, userId: userId, points: this.points, question: this.totalQuestions }
  console.log("onSubmit ==>", Data)
  this.userService.saveAssessmentData(Data).subscribe((res: any) => {
    const userArray = JSON.parse(res.selectedAnswer)
    this.responseArray = this.mergeArrays(this.assesmentData, userArray)
    this.groupQuestionsByIndex()
  })
}else{
  if(this.attempt == 1){
    await this.stopTimer();
    await this.navigateAway('error');
    this.router.navigate([`user/assesments`])
  }
} })


  }


  points = 0
  selectOptionmcq(option: string): void {
    this.buttonSizeForm.get('radioValue')?.setValue(option);
  
    // Remove 'selected' class from all options
    document.querySelectorAll('.questionoptbtn').forEach((el) => {
      el.classList.remove('selected');
    });
    document.querySelectorAll('.questionoptbtn1').forEach((el) => {
      el.classList.remove('selected');
    });
  
    // Add 'selected' class to the clicked option
    const selectedOption = document.getElementById(`option${option}`);
    if (selectedOption) {
      selectedOption.parentElement?.classList.add('selected');
    }
  }
  selectOptiontf(option: string): void {
    this.buttonSizeForm.get('booleanValue')?.setValue(option);
  
    // Remove 'selected' class from all options
    document.querySelectorAll('.questionoptbtn').forEach((el) => {
      el.classList.remove('selected');
    });
    document.querySelectorAll('.questionoptbtn1').forEach((el) => {
      el.classList.remove('selected');
    });
  
    // Add 'selected' class to the clicked option
    const selectedOption = document.getElementById(`option${option}`);
    if (selectedOption) {
      selectedOption.parentElement?.classList.add('selected');
    }
  }
  
  async nextQuestion(data: any): Promise<any> {
    this.timerStatus = 'success';

    if (data.questionType === "MCQ") {
      const mcqAns = this.buttonSizeForm.get('radioValue')?.value;
   
      if (mcqAns !== data.correctAnswer)  { 
        if (  this.attempt == 2){
          await this.stopTimer();
          await this.navigateAway('error');
          this.router.navigate([`user/assesments`])
        }
        this.loadAudio(false)
        this.attempt = this.attempt - 1
        const AnsData = { index: this.currentQuestionIndex, selectedAnswer: mcqAns, attempt: this.attempt, isCorrect: false, questionId: data.id }
        this.AnswerArray.push(AnsData)
        this.isWrongBefore = true;
        this.answerStatus = 'incorrect';
        this.message.error('Incorrect Answer, Please Try Again')

      } else {
        this.loadAudio(true)
        this.attempt = this.attempt - 1
        const AnsData = { index: this.currentQuestionIndex, selectedAnswer: mcqAns, attempt: this.attempt, isCorrect: true, questionId: data.id }
        this.AnswerArray.push(AnsData)
        console.log(AnsData)
        if (!this.isWrongBefore) {
          this.points = this.points + 1;
        }
        console.log("points", this.points)
        if (this.currentQuestionIndex !== this.totalQuestions - 1) {
          this.currentQuestionIndex = this.currentQuestionIndex + 1;
        }
        this.buttonSizeForm.get('radioValue')?.reset
        this.populateQuestionData();
        this.attempt = 4
        this.answerStatus = 'correct';
    
      }
      this.buttonSizeForm.reset()
    }
    else if (data.questionType === "MCA") 
    {
      const stringArray = data.correctAnswer.split(',');
      const mcaAns = this.arraysAreEqual(stringArray, this.selectedOptions)
      if (mcaAns !== true || mcaAns === undefined ) {
        this.loadAudio(false)
        
        this.attempt = this.attempt - 1
        this.message.error('Incorrect Answer, Please Try Again')
        this.answerStatus = 'incorrect';
        const AnsData = { index: this.currentQuestionIndex, selectedAnswer: mcaAns, attempt: this.attempt, isCorrect: false, questionId: data.id }
        this.AnswerArray.push(AnsData)
        this.isWrongBefore = true;
        return true
        
      }
      else {
        this.loadAudio(true)
        if (!this.isWrongBefore) {
          this.points = this.points + 1;
        }
        this.attempt = this.attempt - 1
        const AnsData = { index: this.currentQuestionIndex, selectedAnswer: this.selectedOptions, attempt: this.attempt, isCorrect: true, questionId: data.id }
        this.AnswerArray.push(AnsData)
        console.log(AnsData)
        this.currentQuestionIndex = this.currentQuestionIndex + 1;
        this.buttonSizeForm.get('radioValue')?.reset
        this.populateQuestionData();
        this.attempt = 4
        this.answerStatus = 'correct';
      }
      this.buttonSizeForm.reset()

    }
    else if (data.questionType === "TF") {
      const tfAns = this.buttonSizeForm.get('booleanValue')?.value;
      if (tfAns !== data.correctAnswer) {
        this.loadAudio(false)
        this.attempt = this.attempt - 1
        const AnsData = { index: this.currentQuestionIndex, selectedAnswer: tfAns, attempt: this.attempt, isCorrect: false, questionId: data.id }
        this.AnswerArray.push(AnsData)
        this.isWrongBefore = true;
        this.answerStatus = 'incorrect';
        this.message.error('Incorrect Answer, Please Try Again')
      } else {
        this.loadAudio(true)
        this.attempt = this.attempt - 1
    

        const AnsData = { index: this.currentQuestionIndex, selectedAnswer: tfAns, attempt: this.attempt, isCorrect: true, questionId: data.id }
        this.AnswerArray.push(AnsData)
        if (!this.isWrongBefore) {
          this.points = this.points + 1;
        }
        this.currentQuestionIndex = this.currentQuestionIndex + 1;
        this.buttonSizeForm.get('booleanValue')?.reset
        this.populateQuestionData();
        this.attempt = 4
        this.answerStatus = 'correct';
      }
      this.buttonSizeForm.reset()
    }
    else if (data.questionType === "Blanks") {
      const mcqAns = this.buttonSizeForm.get('inputValue')?.value;
      
      const answer = data.correctAnswer.toLowerCase();
      const mcqAnsLowerCase = mcqAns.toLowerCase();
      if (mcqAnsLowerCase !== answer) {
        this.loadAudio(false)
        this.attempt = this.attempt - 1
        const AnsData = { index: this.currentQuestionIndex, selectedAnswer: mcqAnsLowerCase, attempt: this.attempt, isCorrect: false, questionId: data.id }
        this.AnswerArray.push(AnsData)
        this.isWrongBefore = true;
        this.answerStatus = 'incorrect';
        this.message.error('Incorrect Answer, Please Try Again')
      } else {
        this.loadAudio(true)
        this.attempt = this.attempt - 1
      

        const AnsData = { index: this.currentQuestionIndex, selectedAnswer: mcqAnsLowerCase, attempt: this.attempt, isCorrect: true, questionId: data.id }
        this.AnswerArray.push(AnsData)
        if (!this.isWrongBefore) {
          this.points = this.points + 1;
        }
        this.currentQuestionIndex = this.currentQuestionIndex + 1;
        this.buttonSizeForm.get('inputValue')?.reset
        this.populateQuestionData();
        this.attempt = 4
        this.answerStatus = 'correct';
      }
      this.buttonSizeForm.reset()
    }
    this.TimeCounter = 60;

    if(this.answerStatus == 'correct'){
      return true
    }else{
      return false
    }

  }
  arraysAreEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
  
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();
  
    return sortedArr1.every((value, index) => value === sortedArr2[index]);
  }
  

  selectOption(option: string) {
    // Check if the option is already selected
    const index = this.selectedOptions.indexOf(option);

    if (index !== -1) {
      // If it's selected, deselect it
      this.selectedOptions.splice(index, 1);
    } else {
      // If it's not selected, select it
      this.selectedOptions.push(option);

    }
    return this.selectedOptions
  }
  isSelected(option: string): boolean {
    return this.selectedOptions.includes(option);
  }

  async loadAudio(value: boolean) {
    const soundPath = value
      ? '../../../../assets/sounds/mixkit-achievement-bell-600.wav '
      : '../../../../assets/sounds/mixkit-wrong-long-buzzer-954.wav';

    const response = await fetch(soundPath);
    const arrayBuffer = await response.arrayBuffer();
    this.audioContext.decodeAudioData(arrayBuffer, (buffer) => {
      this.audioBuffer = buffer;
      const source = this.audioContext.createBufferSource();
      source.buffer = this.audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    });
  }

  groupQuestionsByIndex() {
    this.responseArray.forEach(async question => {
      const index = question.index;

      if (this.groupedQuestions.has(index)) {
        await (this.groupedQuestions.get(index) as any[]).push(question);

      } else {
        await this.groupedQuestions.set(index, [question]);

      }

    });
    console.log(this.groupedQuestions)
  }


  mergeArrays(arr1: any[], arr2: any[]): any[] {
    const mergedMap = new Map();
    this.totalQuestion = arr1.length
    this.totalAttempts = arr2.length
    this.totalAttempts = this.totalQuestion - this.totalAttempts + 1
    this.finalScore =
      // Populate the map with objects from the first array
      arr1.forEach(item => {
        mergedMap.set(item.index, item);
        // Trigger change detection here
      });
    const mergedArray: any[] = [];

    arr2.forEach(item => {
      const existingItem = mergedMap.get(item.index);

      const mergedObject = {
        index: existingItem.index,
        question: existingItem.question,
        optionA: existingItem.optionA,
        optionB: existingItem.optionB,
        optionC: existingItem.optionC,
        optionD: existingItem.optionD,
        questionType: existingItem.questionType,
        correctAnswer: existingItem.correctAnswer,
        attempts: item.attempt,
        selectedAnswer: item.selectedAnswer
      };
      mergedArray.push(mergedObject);
      //}
    });
    console.log("mergedArray", mergedArray)
    return mergedArray;
  }

  reviewTest(): void {
    this.isResultVisible = false;
    this.isAssesmentCompleted = true;
  }



  gotoRatings(): void {
    console.log('Button cancel clicked!');
    this.isResultVisible = false;
    this.isRatingVisible = true;
  }

  handleOk(): void {
    this.isRatingVisible = false;
    this.cd.detectChanges();
    // Accessing the rating value
    const selectedRating = this.ratingValue;
    console.log('Selected Rating:', selectedRating);

    window.alert(selectedRating)
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isRatingVisible = false;
    this.goBackToCourse()
  }
  id: any
  goBackToCourse() {
    this.router.navigate([`user/course-details/`])
  }

  async startAssesments() {
    this.isAssesmentCompleted = false ;
     this.isAssesmentStarted =  true;
    await this.addTimer()
  }

  // async addTimer(){
  //   // Wait for timeCounter to complete
  //   await this.timeCounter();
  //   // Execute code after timeCounter
  //   if (!this.isMessageShown) {
  //     if (this.attempt === 2){
  //       await this.navigateAway('error');
  //       this.router.navigate([`seafarer/course-details/${this.id}`])
  //     }
  //  else{
  //   this.timeoutActions()
  //   this.loadAudio(false);
  //  }
  //   }
  // }

  // async timeoutActions() {
  //   // Reset the counter and start again
  //  this.isMessageShown = true;
  //   this.attempt = this.attempt - 1;
    
  //   this.TimeCounter = 20;
  //   this.isMessageShown = false;
  //   this.timerStatus = 'success';

  //    this.addTimer()
  // }
  // timerInterval: any;
  // timeCounter() {
  //   return new Promise<void>((resolve) => {
  //     this.timerInterval = setInterval(async () => {
  //       if (this.TimeCounter === 15) {
  //         this.timerStatus = 'exception';
  //       }
  //       if (this.TimeCounter === 0) {
  //         await this.stopTimer();
  //         if (this.attempt > 2) {
  //           this.timeOut('error');
  //         }
  //         if (this.attempt === 1) {
  //           await this.stopTimer();
  //         }
  
  //         // 
  //         clearInterval(this.timerInterval);
  //         resolve(); // Resolve the promise to indicate the counter has ended
  //       } else {
  //         console.log(this.TimeCounter--);
  //       }
  //     }, 1000);
  //   });
  // }
  
  // // Function to stop the timer
  // stopTimer() {
  //   clearInterval(this.timerInterval);
  // }

  async addTimer() {
    await this.timeCounter();
  
    if (!this.isMessageShown) {
      if (this.attempt === 2) {
        await this.navigateAway('error');
        this.router.navigate([`seafarer/course-details/${this.id}`]);
      } else {
        this.timeoutActions();
      }
    }
  }
  
  timeoutActions() {
    this.isMessageShown = true;
    this.attempt--;
    this.TimeCounter = 60;
    this.isMessageShown = false;
    this.timerStatus = 'success';
  
    this.addTimer();
  }
  
  timerInterval: any;
  isPulsating: boolean = false;

  timeCounter() {
    return new Promise<void>((resolve) => {
      this.timerInterval = setInterval(() => {
        if (this.TimeCounter === 15) {
          this.timerStatus = 'exception';
          // Enable pulsating animation when timer reaches 15 seconds
          this.isPulsating = true;
        }
        if (this.TimeCounter === 0) {
          this.stopTimer();
  
          if (this.attempt > 2) {
            this.timeOut('error');
          }
          if (this.attempt === 1) {
            this.stopTimer();
          }
  
          clearInterval(this.timerInterval);
          // Reset pulsating animation after the timer reaches 0
          this.isPulsating = false;
          resolve();
        } else {
          console.log(this.TimeCounter--);
        }
      }, 1000);
    });
  }
  
  stopTimer() {
    clearInterval(this.timerInterval);
  }
  


  async submitFeedback(){
    const userId = await this.auth.getIdFromToken();
    const rating = this.ratingValue;
    const review = this.feedValue;
    const data = { rating,review,userId,videoId:this.id }
    console.log("feedback ==>",data)
this.userService.saveFeedback(data).subscribe((res:any) => {
  console.log(data)
  this.isRatingVisible = !this.isRatingVisible;
  this.goBackToCourse();
})
    }
    ngOnDestroy() {
      this.stopTimer()
    }
  ngOnInit() {
    this.timerStatus = 'success';

    this.id = 1
        this.getAssesmentQuestions(this.id)
    //   this.seaService.getAssesmentData(this.id).subscribe((res: any) => {
    //     const userArray = JSON.parse(res.selectedAnswer)
    //     this.responseArray = this.mergeArrays(this.assesmentData, userArray)
    //     this.groupQuestionsByIndex()
    //   })
    //   this.isResultVisible = true;


 }

}
