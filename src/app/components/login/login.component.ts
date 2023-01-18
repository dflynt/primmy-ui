import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { RestService } from 'src/app/services/rest/rest.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

@Injectable()
export class LoginComponent implements OnInit {

  userService: UserService;
  user: User;
  formBuilder: FormBuilder = new FormBuilder();
  router: Router;
  loginLoading: boolean;
  errormessagetextcolor: String = "white";

  constructor(formBuilder: FormBuilder, router: Router, userService: UserService) { 
    this.router = router;
    this.formBuilder = formBuilder;
    this.userService = userService;
  }
  
  loginForm = this.formBuilder.group({
    email: new FormControl(''),
    password: new FormControl('')
  });

  ngOnInit(): void {
    
    let cookies = this.userService.getCookies();
    let email = cookies['primmyEmail'];
    let password = cookies['primmyPassword'];
    if(email == null && password == null) {
      return;
    }
    else if(email != '' && password != '') {
      this.loginForm.controls['email'].setValue(email);
      this.loginForm.controls['password'].setValue(password);
      this.onSubmit();
    }
  }

  onSubmit(): void {
    this.loginLoading = true;
    let password: any = this.loginForm.get('password')?.value;
    this.userService.attemptLogin(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value).subscribe( 
      result => {
        this.setCookies();
        let user: User = result;
        this.userService.setCurrentUser(user);
        this.errormessagetextcolor = "white";
        this.userService.setCookie("primmyEmail", user.email);
        this.userService.setCookie("primmyAuthToken", user.authToken);
        this.userService.setCookie("primmyPassword", password);
        this.userService.setCookie("primmyRefreshToken", user.refreshToken);
        this.userService.setCookie("primmyFirstName", user.firstName);
        this.loginLoading = false;
        this.router.navigateByUrl("/journal");
        console.log("success");
      },
      error => {
        this.loginLoading = false;
        this.errormessagetextcolor = "red";
      })
  }

  setCookies(): void {

  }
}
