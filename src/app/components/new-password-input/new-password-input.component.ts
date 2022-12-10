import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-new-password-input',
  templateUrl: './new-password-input.component.html',
  styleUrls: ['./new-password-input.component.css']
})
export class NewPasswordInputComponent implements OnInit {

  userService: UserService;
  newPassword: string = "";
  confirmedPassword: string = "";
  displayInsufficientPasswordErrorMessage: boolean = false;
  displayDifferentPasswordErrorMessage: boolean = false;

  resetEmailSent: boolean = false;
  router: Router;
  displayRetrievingUserIcon: boolean = false;
  displaySignInLoadingIcon: boolean = false;

  errorMessages: string[] = [];
  displayErrorMessages: boolean = false;
  SHORT_PASSWORD_ERROR: string = "New password must be longer than 8 characters.";
  UNMATCHING_PASSWORD_ERROR: string = "Your passwords do not match";

  constructor(userService: UserService, router: Router) {
    this.router = router;
    this.userService = userService;
  }

  ngOnInit(): void {
    let userId = this.router.url.substring(19);
    this.displayRetrievingUserIcon = true;
    this.userService.queryForUser(userId).subscribe(
      result => {
        this.displayRetrievingUserIcon = false;
        this.userService.setCurrentUser(result);
      },
      error => {
        this.displayRetrievingUserIcon = false;
      }
    );
  }

  resetPassword(): void {
    let userId = this.userService.getCurrentUser()['userid'];
    this.validateNewPassword();
  
    if(this.errorMessages.length == 0) {
      this.displaySignInLoadingIcon = true;
      this.userService.resetPassword(userId, this.newPassword).subscribe(
        result => {
          this.resetEmailSent = true;
          this.userService.attemptLogin(this.userService.getCurrentUser()['email'], this.newPassword).subscribe(
            result => {
              let user: User = result;
              this.userService.setCurrentUser(user);
              this.userService.setCookie("primmyEmail", user.email);
              this.userService.setCookie("primmyAuthToken", user.authToken);
              this.userService.setCookie("primmyPassword", this.newPassword);
              this.userService.setCookie("primmyRefreshToken", user.refreshToken);
              this.displayRetrievingUserIcon = false;
              this.router.navigateByUrl("/journal");
            },
            error => {
              this.displayRetrievingUserIcon = false;
            })
          },
        error => {
          console.log("Error setting new password: ");
          console.log(error);
        } 
      )
    }
  }

  validateNewPassword() {
    if(this.newPassword.length < 8) {
      console.log("New password length error");
      if(!this.errorMessages.includes(this.SHORT_PASSWORD_ERROR)) {
        console.log("New pass");
        console.log("adding short PW error");
        this.errorMessages.push(this.SHORT_PASSWORD_ERROR);
        this.displayErrorMessages = true;
      }
      else {
        console.log(this.errorMessages);
        console.log("error messages don't contian " + this.SHORT_PASSWORD_ERROR);
      }
    }
    else {
      console.log("Removing short password error");
      this.removeErrorMessageByName(this.SHORT_PASSWORD_ERROR);
    }

    if(this.newPassword != this.confirmedPassword) {
      if(!this.errorMessages.includes(this.UNMATCHING_PASSWORD_ERROR)) {
        console.log("unmatching password");
        this.displayErrorMessages = true;
        this.errorMessages.push(this.UNMATCHING_PASSWORD_ERROR);
      }
    }
    else {
      this.removeErrorMessageByName(this.UNMATCHING_PASSWORD_ERROR);
    }

    if(this.errorMessages.length == 0) {
      this.displayErrorMessages = false;
    }
  }

  removeErrorMessageByName(error: string) {
    let index = this.errorMessages.findIndex(item => {
      return item == error;
    });
    console.log(index);
    if(index != -1) {
      this.errorMessages.splice(index, 1);
      console.log("resulting errors");
      console.log(this.errorMessages);
    }
  }
}
