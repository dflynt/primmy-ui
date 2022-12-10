import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  resetEmailSent: boolean = false;
  displayEmailErrorMessage: boolean = false;
  formBuilder: FormBuilder = new FormBuilder();
  userService: UserService;
  router: Router;
  displayLoadingIcon: boolean = false; 
  constructor(formBuilder: FormBuilder, userService: UserService, router: Router) {
    this.router = router;
    this.userService = userService;
    this.formBuilder = formBuilder;
  }

  passwordForm = this.formBuilder.group({
    email: new FormControl(''),
  });

  onSubmit() {
    if(this.passwordForm.get("email")?.value?.length == 0) {
      this.displayEmailErrorMessage = true;
      return;
    }
    this.displayEmailErrorMessage = false;
    this.displayLoadingIcon = true;
    this.userService.requestNewPassword(this.passwordForm.get("email")?.value).subscribe(
      result => {
        this.displayLoadingIcon = false;
        this.resetEmailSent = true;
      },
      error => {
        console.log(error);
        this.displayEmailErrorMessage = true;
        this.displayLoadingIcon = false;
      }
    )
  }

  ngOnInit(): void {
  }

}
