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
  constructor(private rest: RestService, private  cookies: CookieService) {}

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

  
  enableUser(userId: String, verificationCode: String): Observable<any> {
    return this.rest.put("/verify/" + userId + "/verificationCode/" + verificationCode, 
                          this.userPortNumber, null, null);
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
