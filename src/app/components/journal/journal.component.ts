import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TinyMCE } from 'tinymce/tinymce';

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
  displayEditJournalModal: boolean = false;
  displayDeleteJournalConfirmationModal: boolean = false;
  displayNewJournalModalLoadingIcon: boolean = true;
  displayEditJournalModalLoadingIcon: boolean = false;
  displayInvalidUpdatedTitlesMessage: boolean = false;
  displayJournalSavingMessage: boolean = false;

  journalColor: string;

  loadingIcon: boolean = false;

  newJournalTitle: string = "";
  newJournalSubTitle: string = "";

  editedJournalTitle: string = "";
  editedJournalSubtitle: string = "";
  
  constructor(journalService: JournalService, router: Router, userService: UserService) {
    this.journalService = journalService;
    this.router = router;
    this.userService = userService;
    this.journalService.journalChange.subscribe((journalId: string) => {
      this.retrieveCurrentJournalData(journalId);      
    })

    this.journalService.topicColorchange.subscribe((topicColor: string) => {
      this.journalColor = topicColor;
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
    this.text = '';
    let userId = this.userService.getCurrentUser()['userid'];
    let authToken = this.userService.getCurrentUser()['authToken'];
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
    this.text += this.currentJournal.entry;
    this.editedJournalTitle = this.currentJournal.title;
    this.editedJournalSubtitle = this.currentJournal.subTitle;
    this.journalsForCurrentTopic.set(journal.journalId, journal);
  }

  createNewJournal() {
    let userId = this.userService.getCurrentUser()['userid'];
    let authToken = this.userService.getCurrentUser()['authToken'];
    this.displayNewJournalModalLoadingIcon = true;
    let journal: Journal = {
      id: "",
      journalId: "",
      userId: userId,
      topicId: this.journalService.getCurrentTopic(),
      title: this.newJournalTitle,
      subTitle: this.newJournalSubTitle,
      entry: "",
      figures: "",
      createdDate: new Date(),
      lastModified: new Date(),
      hidden: false
    }

    console.log("New journal created");
    console.log(journal);

    this.journalService.createNewJournal(journal, authToken).subscribe(
      result => {
        this.journalService.getJournalPreviewsByUserIdAndTopicId(userId,this.journalService.getCurrentTopic(), authToken).subscribe(
          result => {
            this.journalService.displayRetrievedPreviews(result);
            this.closeNewJournalModal();
          },
          error => {
            console.log("Error retrieving journal previews after creating enw journal");
          }
        );
      },
      error => {
        console.log("Error creating journal");
      }
    )
  }

  saveJournalText() {
    //Set current journal to make it available
    this.displayJournalSavingMessage = true;
    let authToken = this.userService.getCurrentUser()['authToken'];
    this.currentJournal.entry = this.text;
    this.journalService.saveJournalText(this.currentJournal, authToken).subscribe(
      result => {
        this.displayJournalSavingMessage = false;
      },
      error => {
        console.log(error);
        this.displayJournalSavingMessage = false;
      }
    );
  }

  updateJournal() {
    this.displayEditJournalModalLoadingIcon = true;
    let authToken = this.userService.getCurrentUser()['authToken'];
    let params = {
      updatedTitle: this.editedJournalTitle,
      updatedSubtitle: this.editedJournalSubtitle
    }
    if(params.updatedTitle.length == 0) {
      console.log("Title must not be empty.");
      this.displayInvalidUpdatedTitlesMessage = true;
      this.editedJournalTitle = this.currentJournal.title;
      this.editedJournalSubtitle = this.currentJournal.subTitle;
      return;
    }
    this.journalService.updateJournal(this.journalService.getCurrentJournalId(), params, authToken).subscribe(
      result => {
        this.displayInvalidUpdatedTitlesMessage = false;
        this.retrieveCurrentJournalData(this.currentJournal.journalId);
        this.journalService.updateJournalTitle(params);
        this.closeEditJournalModal();
      },
      error => {
        this.displayInvalidUpdatedTitlesMessage = true;
      }
    )
  }

  deleteCurrentJournal() {
    let authToken = this.userService.getCurrentUser()['authToken'];
    this.journalService.deleteJournal(this.currentJournal.journalId, authToken).subscribe(
      result => {
        this.journalService.removeJournalFromEntryList();
        this.text = '';
        this.closeDeleteJournalModal();
      },
      error => {
        console.log(error);
        this.closeDeleteJournalModal();
      }
    )
  }

  getCurrentJournal(): Journal {
    if(this.currentJournal == null) {
      let emptyJournal: Journal = {
          id: "",
          journalId: "",
          userId: "",
          topicId: this.journalService.getCurrentTopic(),
          title: "",
          subTitle: "",
          entry: "",
          figures: "",
          createdDate: new Date(),
          lastModified: new Date(),
          hidden: false
        }
        return emptyJournal;
      }
      

      return this.currentJournal;
  }

  showNewJournalModal() {
    this.displayNewJournalModal = true;
  }
  
  closeNewJournalModal() {
    this.displayNewJournalModalLoadingIcon = false;
    this.displayNewJournalModal = false;
    this.newJournalTitle = "";
    this.newJournalSubTitle = "";
  }

  showEditJournalModal() {
    this.displayEditJournalModal = true;
  }

  closeEditJournalModal() {
    this.editedJournalTitle = this.currentJournal.title;
    this.editedJournalSubtitle = this.currentJournal.subTitle;
    this.displayInvalidUpdatedTitlesMessage = false;
    this.displayEditJournalModal = false;
  }

  showDeleteJournalModal() {
    this.displayDeleteJournalConfirmationModal = true;
  }

  closeDeleteJournalModal() {
    this.displayDeleteJournalConfirmationModal = false;
  }
}