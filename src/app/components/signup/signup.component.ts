import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  primeConfig: PrimeNGConfig;
  formBuilder: FormBuilder = new FormBuilder();
  userService: UserService;
  displayModal: boolean = false;
  errormessagetextcolor: String = "white";
  signUpLoading: boolean;
  router: Router;

  constructor(primengConfig: PrimeNGConfig, router: Router,
              formBuilder: FormBuilder, userService: UserService) {
                this.primeConfig = primengConfig;
                this.router = router;
                this.formBuilder = formBuilder;
                this.userService = userService;
               }
  
  signUpForm = this.formBuilder.group({
    email: new FormControl(''),
    password: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    institution: new FormControl(''),
    field: new FormControl(''),
    focus: new FormControl('')
  })

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.signUpLoading = true;
    let u: User = {
      userid: "0",
      email: this.signUpForm.get('email')?.value!,
      password: this.signUpForm.get('password')?.value!,
      firstName: this.signUpForm.get('firstName')?.value!,
      lastName: this.signUpForm.get('lastName')?.value!,
      institution: this.signUpForm.get('institution')?.value!,
      field: this.signUpForm.get('field')?.value!,
      focus: this.signUpForm.get('focus')?.value!,
      signupdate: new Date(),
      avatar: "",
      deleteddate: "",
      verificationcode: "",
      authToken: "",
      refreshToken: ""  
    }

    this.userService.attemptCreateUser(u).subscribe(
      result => {
        console.log(result);
        this.errormessagetextcolor = "white";
        this.signUpLoading = false;
        this.displayModal = true;
      },
      error => {
        this.signUpLoading = false;
        this.errormessagetextcolor = "red";
      }
    );
  }

}
