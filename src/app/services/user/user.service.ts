import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { RestService } from '../rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  authPortNumber: string = "7777";
  userPortNumber: string = "8888";
  authToken: string;
  refreshToken: string;
  currentUser: User
  constructor(private rest: RestService, private cookies: CookieService) {}

  attemptLogin(email: any, password: any): Observable<any> {
    let body = {email: email, password: password};
    return this.rest.post("/login", this.authPortNumber, body, "");
  }

  attemptCreateUser(user: User): Observable<any> {
    let body = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      institution: user.institution,
      field: user.field,
      focus: user.focus,
    }

    return this.rest.post("/user", this.userPortNumber, body, "");
  }

  requestNewPassword(email: any): Observable<any> {
     return this.rest.post("/requestNewPassword/email/" + email, this.userPortNumber, null, "")
  }

  resetPassword(userId: string, newPassword: string): Observable<any> {
    return this.rest.put("/setNewPassword/user/" + userId, this.userPortNumber, newPassword, "");
  }

  queryForUser(userId: string): Observable<any> {
    let response = this.rest.get("/queryForUser/user/" + userId, this.userPortNumber, null, "");
    console.log(response);
    return response;
  }

  enableUser(userId: String, verificationCode: String): Observable<any> {
    return this.rest.put("/verify/" + userId + "/verificationCode/" + verificationCode, 
                          this.userPortNumber, null, null);
  }

  submitNewError(errorText: string): Observable<any> {
    return this.rest.post("/user/" + this.currentUser.userid + "/submitError", this.userPortNumber, errorText, this.authToken);
  }

  submitFeatureSuggestion(feedback: string): Observable<any> {
    return this.rest.post("/user/" + this.currentUser.userid + "/submitFeedback", this.userPortNumber, feedback, this.authToken);
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  getCurrentUser(): User {
    return this.currentUser;
  }
  
  getCookies() {
    return this.cookies.getAll();
  }

  getCookie(cookieName: string) {
    return this.cookies.get(cookieName);
  }

  setCookie(cookieName: string, cookieValue: string) {
    this.cookies.set(cookieName, cookieValue);
  }

  deleteCookie(cookieName: string) {
    this.cookies.delete(cookieName);
  }

  deleteAllCookies() {
    this.cookies.deleteAll();
  }
}
