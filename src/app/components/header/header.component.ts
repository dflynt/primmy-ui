import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private primengConfig: PrimeNGConfig) { }

  loginFormVisible: boolean = false;
  email: string = "";
  password: string = "";

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  showLoginForm() {
    this.loginFormVisible = true;
  }
  hideLoginForm() {
    this.loginFormVisible = false;
  }

}
