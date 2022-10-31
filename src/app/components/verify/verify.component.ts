import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  router: Router;
  userService: UserService;
  route: ActivatedRoute;
  displayLoading: boolean = true;
  displayBadVerification: boolean = false;

  constructor(router: Router, userService: UserService, route: ActivatedRoute) {
    this.router = router;
    this.userService = userService;
    this.route = route;
   }

  ngOnInit(): void {
    let url: String = this.router.url.substring(7);
    let params: String[] = url.split("/");
    let userId = params[1];
    let verificationCode = params[2];
    this.displayLoading = false;
    this.displayBadVerification = true;
    
    this.userService.enableUser(userId, verificationCode).subscribe(
      result => {
        this.displayLoading = false;
        this.router.navigateByUrl("/login")
    },
      error => {
        this.displayLoading = false;
        this.displayBadVerification = true;        
      }
    )
    
  }
  submitBugReport() {
    console.log("Bug report submitted")
    this.router.navigateByUrl("/")
  }

  redirectToHomePage() {
    this.router.navigateByUrl("/");
  }

}
