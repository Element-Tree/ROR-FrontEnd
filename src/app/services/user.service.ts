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

  private isScroll = new BehaviorSubject<boolean>(false);

  get isScroll$() {
    return this.isScroll.asObservable();
  }
  private isScroll1 = new BehaviorSubject<boolean>(false);

  get isScroll1$() {
    return this.isScroll1.asObservable();
  }

  setIsScroll(value: boolean) {
    this.isScroll.next(value);
  }
  setIsScroll1(value: boolean) {
    this.isScroll1.next(value);
  }

  // fetchAllCourses(email: string) {
  //   return this.http.get(BACKEND_URL + `/sea-farer/courses/${email}`);
  // }

  // fetchCourses(courseId: number, userId: any) {
  //   return this.http.get(BACKEND_URL + `/sea-farer/course/${courseId}/${userId}`);
  // }

  // fetchCourseContent(courseId: number, userId: any) {
  //   return this.http.get(BACKEND_URL + `/sea-farer/courseContent/${courseId}/${userId}`);
  // }

  // courseThumbnail(courseId: number) {
  //   return this.http.get(BACKEND_URL + `/sea-farer/courseThumbnail/${courseId}`);
  // }

  // fetchPostsOfCourse(courseId: any) {
  //   return this.http.get(BACKEND_URL + `/sea-farer/posts/${courseId}`);
  // }

  getQuestsionByVideoId(id: any) {
    return this.http.get(BACKEND_URL + `/users/questions/${id}`);
  }

  saveAssessmentData(data: any) {
    return this.http.post(BACKEND_URL + `/sea-farer/Assessment`, data);
  }

  getAssesmentData(id: any) {
    return this.http.get(BACKEND_URL + `/sea-farer/Assessment/${id}`);
  }

  // savePosts(data: any) {
  //   return this.http.post(BACKEND_URL + `/sea-farer/posts`, data);
  // }

  // saveComment(data: any) {
  //   return this.http.post(BACKEND_URL + `/sea-farer/comment`, data);
  // }
  // postLikeCounts(data: any) {
  //   return this.http.post(BACKEND_URL + `/sea-farer/likedbyuser`, data);
  // }

  // changeCourseStatus(data: any) {
  //   return this.http.patch(BACKEND_URL + `/sea-farer/course`, data)
  // }

  // getSeafarerData(id: any, companyId: any) {
  //   return this.http.get(BACKEND_URL + `/sea-farer/users/${id}/${companyId}`)
  // }

  // getFeedBackByCourseId(courseId: any) {
  //   return this.http.get(BACKEND_URL + `/sea-farer/feedback/${courseId}`)
  // }

  saveFeedback(data: any) {
    return this.http.post(BACKEND_URL + `/sea-farer/feedback`, data)
  }






  createUsers(data: any) {
    return this.http.post(BACKEND_URL + '/users/comapny-users', data);
  }

  public getRoleFromStore() {
    return this.role$.asObservable();
  }
}
