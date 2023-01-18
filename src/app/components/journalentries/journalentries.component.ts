import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { Journal } from 'src/app/models/Journal';
import { JournalPreview } from 'src/app/models/JournalPreview';
import { Workbook } from 'src/app/models/Workbook';
import { JournalService } from 'src/app/services/journal/journal.service';
import { UserService } from 'src/app/services/user/user.service';
 
@Component({
  selector: 'app-journalentries',
  templateUrl: './journalentries.component.html',
  styleUrls: ['./journalentries.component.css']
})
export class JournalentriesComponent implements OnInit {

  formBuilder: FormBuilder = new FormBuilder();
  userService: UserService;
  journalService: JournalService;
  journalPreviews: JournalPreview[] = [];
  router: Router;

  retrievingWorkbooks: boolean;
  retrievingPreviews: boolean;
  creatingNewTopic: boolean = false;

  workbooks: Workbook[] = [];
  currentWorkbookIndex: number;
  currentJournalPreviewIndex: number;
  currentJournalPreview: JournalPreview;
  currentWorkbook: Workbook;
  emptyTopicListString: String = "No Workbooks Created";

  displayNewWorkbookModal: boolean = false;
  displayNewWorkbookModalLoadingIcon: boolean = false;
  displayNewJournalModal: boolean = false;
  displayNewJournalModalLoadingIcon: boolean = false;

  newWorkbookName: string = ""
  newWorkbookColor: string = "#57CC99"; //default primmy
  newWorkbookGroupId: string = "";
  
  newJournalTitle: string = "";
  newJournalSubTitle: string = "";
  newJournalSearchTags: string = "";

  selectedValue: string;
  selectedCar: string;

  constructor(router: Router, journalService: JournalService, userService: UserService) { 
    this.journalService = journalService;
    this.router = router;
    this.userService = userService;
    this.journalService.workbookChange.subscribe(() => {
      this.currentJournalPreviewIndex = -1;
      let currPreview: JournalPreview = {
        title: "",
        subTitle: "",
        createdDate: new Date(),
        lastModified: new Date(),
        journalId: ""
      }
      this.currentJournalPreview = currPreview;
    })

    this.journalService.journalChange.subscribe((journalId: string) => {
      if(journalId == '') {
        this.journalPreviews.splice(this.currentJournalPreviewIndex, 1);
        this.currentJournalPreviewIndex = -1;
      }
    })

    this.journalService.journalTitlechange.subscribe((titles: any) => {
      this.currentJournalPreview.title = titles.updatedTitle;
      this.currentJournalPreview.subTitle = titles.updatedSubtitle;
    })

    this.journalService.previewchange.subscribe((preview: any[]) => {
      this.loadRetrievedPreviews(preview);
    })

  }

  ngOnInit(): void {
    let userId = this.userService.getCurrentUser()["userid"];
    let authToken = this.userService.getCurrentUser()["authToken"];
    this.retrievingPreviews = true;
    this.retrievingWorkbooks = true;
      //TODO If user tries to go to this page immediately, look for cookies and try signing in again

    this.journalService.getWorkbooksByUserid(userId, authToken).subscribe(
      result => {
        if(result.length != 0) {
          this.loadRetrievedWorkbooks(result);
          this.journalService.getJournalPreviewsByUserIdAndTopicId(userId, this.currentWorkbook.workbookId, authToken).subscribe(
            result => {
              this.loadRetrievedPreviews(result)              
            },
            error => {
              console.log(error);
            }
          )
        }
        else {
          this.retrievingWorkbooks = false;
          this.retrievingPreviews = false;
        }
        
      },
      error => {
        console.log(error.error);
      }
    );
    //TODO set currentTopic equal to last opened topic
    //this can be a setting under Profile to enable or disable
    this.currentWorkbook = this.workbooks[0];
    this.retrievingWorkbooks = false;

  }

  setSelectedPreviewIndex(index: number) {
    this.currentJournalPreviewIndex = index;
    this.currentJournalPreview = this.journalPreviews[index];
    this.journalService.setCurrentJournal(this.journalPreviews[index].journalId, this.journalPreviews[index].title, this.journalPreviews[index].subTitle);
  }

  loadRetrievedWorkbooks(result: any) {
    console.log(result);
    this.workbooks = [];
    result.map((workbook:Workbook) => {
      let newWorkbook: Workbook = {
        workbookName: workbook.workbookName,
        workbookId: workbook.workbookId,
        userId: workbook.userId,
        groupId: workbook.groupId,
        color: workbook.color,
        createdDate: workbook.createdDate
      }
     this.workbooks.push(newWorkbook) 
    })
    this.currentWorkbookIndex = 0;
    console.log(this.workbooks);
    this.currentWorkbook = this.workbooks[this.currentWorkbookIndex];
    this.journalService.setCurrentWorkbook(this.currentWorkbook.workbookId, this.currentWorkbook.workbookName, this.currentWorkbook.color);
    this.retrievingWorkbooks = false;
  }

  loadRetrievedPreviews(result: any) {
    this.journalPreviews = [];
    result.map((preview: JournalPreview) => {
      let newPreview: JournalPreview = {
        title: preview.title,
        subTitle: preview.subTitle,
        createdDate: preview.createdDate,
        lastModified: preview.lastModified,
        journalId: preview.journalId
      }

      this.journalPreviews.push(newPreview);
    })

    this.currentJournalPreview = this.journalPreviews[0];
    this.retrievingPreviews = false;
  }

  changeWorkbooks(index: number) {
    if(index == this.currentWorkbookIndex) {
      return;
    }
    this.currentWorkbookIndex = index;
    this.retrievingPreviews = true;
    this.currentWorkbook = this.workbooks[index];
    this.journalService.setCurrentWorkbook(this.currentWorkbook.workbookId, this.currentWorkbook.workbookName, this.currentWorkbook.color);
    let userId = this.userService.getCurrentUser()['userid'];
    let authToken = this.userService.getCurrentUser()['authToken'];

    this.journalService.getJournalPreviewsByUserIdAndTopicId(userId, this.currentWorkbook.workbookId, authToken).subscribe(
      result => {
        this.loadRetrievedPreviews(result);
      },
      error => {
        console.log(error);
      }
    )
    this.retrievingPreviews = false;
  }

  showNewWorkbookModal() {
    this.displayNewWorkbookModal = true;
  }

  closeNewWorkbookModal() {
    this.displayNewWorkbookModalLoadingIcon = false;
    this.displayNewWorkbookModal = false;
    this.newWorkbookGroupId = "";
    this.newWorkbookColor = "";
    this.newWorkbookName = "";
  }

  createNewWorkbook() {
    this.creatingNewTopic = true;
    this.displayNewWorkbookModalLoadingIcon = true;
    let authToken = this.userService.getCurrentUser()['authToken'];
    if(this.newWorkbookGroupId.length > 0) {
      // TODO
      //Make API request to check for class with this id
    }
    else {
      let newWorkbook: Workbook = {
        workbookName: this.newWorkbookName,
        workbookId: "",
        userId: this.userService.getCurrentUser()["userid"],
        color: this.newWorkbookColor,
        groupId: this.newWorkbookGroupId,
        createdDate: new Date()
      };
      this.journalService.createNewWorkbook(newWorkbook, authToken).subscribe(
        result => {
          newWorkbook.workbookId = result["topicId"];
          this.journalService.setCurrentWorkbook(result["topicId"], result["topicName"], result["color"]);
          this.workbooks.push(newWorkbook);
          this.currentWorkbook = newWorkbook;
          this.journalPreviews = [];
        },
        error => {

        }
      );
      this.closeNewWorkbookModal();
    }
  }
}
