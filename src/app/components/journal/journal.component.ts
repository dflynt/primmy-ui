import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Editor } from 'primeng/editor';
import { Journal } from 'src/app/models/Journal';
import { User } from 'src/app/models/User';
import { JournalService } from 'src/app/services/journal/journal.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent implements OnInit {
  
  journalsForCurrentTopic = new Map();
  journalService: JournalService;
  userService: UserService;
  router: Router;
  currentJournal: Journal;
  text: string;
  errorLoadingJournal: boolean = false;
  displayNewJournalModal: boolean = false;

  loadingIcon: boolean = false;

  newJournalTitle: string = "";
  newJournalSubTitle: string = "";
  newJournalSearchTags: string = "";
  
  constructor(journalService: JournalService, router: Router, userService: UserService) {
    this.journalService = journalService;
    this.router = router;
    this.userService = userService;
    this.journalService.journalChange.subscribe((journalId: string) => {
      this.retrieveCurrentJournalData(journalId);      
    })
   }

  ngOnInit(): void {
    if(this.userService.getCurrentUser() == null) {
      this.loadingIcon = true;
      let cookies = this.userService.getCookies();
      let email = cookies['primmyEmail'];
      let password = cookies['primmyPassword'];

      if(email == null && password == null) {
        this.router.navigateByUrl("/login");
        return;
      }
      else if(email != '' && password != '') {
        this.userService.attemptLogin(email, password).subscribe( 
          result => {
            let user: User = result;
            this.userService.setCurrentUser(user);
            this.userService.setCookie("primmyEmail", user.email);
            this.userService.setCookie("primmyAuthToken", user.authToken);
            this.userService.setCookie("primmyPassword", password);
            this.userService.setCookie("primmyRefreshToken", user.refreshToken);
            this.loadingIcon = false;
          },
          error => {
            this.router.navigateByUrl("/login");
          });
      }
    }
    else {
      return;
    }
    
  }

  retrieveCurrentJournalData(journalId: string) {
    let userId = this.userService.getCurrentUser()['userid'];
    let authToken = this.userService.getCurrentUser()['authToken'];
    console.log("retrieveCurrentJournalData() " + userId + " " + authToken);
    this.journalService.getJournalDataByJournalId(userId, journalId, authToken).subscribe(
      result => {
        if(result != null) {
          this.createNewJournalObj(result);
        }
        this.loadingIcon = false;
      },
      error => {
        this.errorLoadingJournal = true;
      }
    );
  }

  createNewJournalObj(result: any) {
    let journal: Journal = {
      id: result.id,
      journalId: result.journalId,
      userId: result.userId,
      topicId: result.topicId,
      title: result.title,
      subTitle: result.subTitle,
      entry: result.entry,
      figures: result.figures,
      createdDate: result.createdDate,
      lastModified: result.lastModified,
      hidden: result.hidden
    }
    this.currentJournal = journal;
    this.journalsForCurrentTopic.set(journal.journalId, journal);
  }

  saveJournal() {
    //Set current journal to make it available
    let authToken = this.userService.getCurrentUser()['authToken'];
    this.journalService.saveJournal(this.currentJournal, authToken).subscribe(
      result => {
        console.log("Successfully saved new journal");
        console.log(result);
      },
      error => {
        console.log(error);
      }
    );
  }
}
