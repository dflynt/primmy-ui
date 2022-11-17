import { Component, OnInit } from '@angular/core';
import { Group } from 'src/app/models/Group';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  groups: Group[];
  displayJoinGroupModal: boolean = false;

  constructor() {

  }
  ngOnInit(): void {

  }

  showJoinGroupModal(): void {
    this.displayJoinGroupModal = true;
  }

  closeJoinGroupModal(): void {
    this.displayJoinGroupModal = false;
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
