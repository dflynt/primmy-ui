import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-journal-header',
  templateUrl: './journal-header.component.html',
  styleUrls: ['./journal-header.component.css']
})
export class JournalHeaderComponent implements OnInit {

  userService: UserService;
  user: User;
  userName: string;

  constructor(userService: UserService) { 
    this.userService = userService;
  }

  ngOnInit(): void {
    let cookies = this.userService.getCookies();
    this.userName = cookies['primmyFirstName'];
  }

}
