import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sectionTwoDisplayed: boolean = false;
  sectionThreeDisplayed: boolean = false;
  @HostListener('window:scroll', ['$event'])
  onScroll() {
     if(window.pageYOffset >= 300) {
      if(!this.sectionTwoDisplayed) {
        this.sectionTwoDisplayed = true;
      }
     }
     if(window.pageYOffset >= 1200) {
      if(!this.sectionThreeDisplayed) {
        this.sectionThreeDisplayed = true;
      }
     }
  }
  constructor() {}

  ngOnInit(): void {
  }
}
