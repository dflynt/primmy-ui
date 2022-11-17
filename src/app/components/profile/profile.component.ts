import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  editProfileTabIsVisible: boolean = true;
  groupsTabIsVisible: boolean = false;

  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  ngOnInit(): void {
    
  }



  showEditProfileTab(): void {
    this.editProfileTabIsVisible = true;
    this.groupsTabIsVisible = false;
  }

  showGroupsTab(): void {
    this.editProfileTabIsVisible = false;
    this.groupsTabIsVisible = true;
  }



}
