import { group } from '@angular/animations';
import { Component, Injectable, OnInit } from '@angular/core';
import { Group } from 'src/app/models/Group';
import { GroupService } from 'src/app/services/group/group.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  groups: Group[];
  displayJoinGroupModal: boolean = false;
  displayCreateGroupModal: boolean = false;
  displayGroupLoadingIcon: boolean = false;
  displayErrorCreatingGroupMessage: boolean = false;
  displayTooShortGroupNameError: boolean = false;
  userService: UserService;
  groupService: GroupService;

  newGroupNameInput: string = "";

  constructor(userService: UserService, groupService: GroupService) {
    this.userService = userService;
    this.groupService = groupService;
  }

  ngOnInit(): void {

  }

  createNewGroup(): void {
    if(this.newGroupNameInput.length < 5) {
      this.displayTooShortGroupNameError = true;
      return;
    }
    let userId = this.userService.getCurrentUser()["userid"];
    let authToken = this.userService.getCurrentUser()["authToken"];
    this.displayGroupLoadingIcon = true;
    this.groupService.createGroup(this.newGroupNameInput, userId, authToken).subscribe(
      result => {
        this.groups.push(result);
        this.displayGroupLoadingIcon = false;
        this.displayCreateGroupModal = false;
        this.displayTooShortGroupNameError = false;
      },
      error => {
        this.displayErrorCreatingGroupMessage = true;
        this.displayGroupLoadingIcon = false;
        this.displayCreateGroupModal = false;
      }
    )
  }
 
  showCreateGroupModal(): void {
    this.displayCreateGroupModal = true;
  }

  closeCreateGroupModal(): void {
    this.displayCreateGroupModal = false;
    this.displayGroupLoadingIcon = false;
  }

  showJoinGroupModal(): void {
    this.displayJoinGroupModal = true;
  }

  closeJoinGroupModal(): void {
    this.displayJoinGroupModal = false;
  }

  generateGroupId(): void {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 9; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log(result);    
  }

  redirectToGroupEntries(): void {
    
  }

  getGroupsLength(): number {
    if(this.groups == null) {
      return 0;
    }
    else {
      return this.groups.length;
    }
    
  }

}
