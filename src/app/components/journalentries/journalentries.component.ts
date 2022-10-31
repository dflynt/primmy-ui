  import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { Journal } from 'src/app/models/Journal';
import { JournalPreview } from 'src/app/models/JournalPreview';
import { Topic } from 'src/app/models/Topic';
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

  retrievingTopics: boolean;
  retrievingPreviews: boolean;
  creatingNewTopic: boolean = false;

  topics: Topic[] = [];
  currentTopicIndex: number;
  currentJournalPreviewIndex: number;
  currentJournalPreview: JournalPreview;
  currentTopic: Topic;
  emptyTopicListString: String = "No Topics Created";

  displayNewTopicModal: boolean = false;
  displayNewTopicModalLoadingIcon: boolean = false;
  displayNewJournalModal: boolean = false;
  displayNewJournalModalLoadingIcon: boolean = false;

  newTopicName: string = ""
  newTopicColor: string = "";
  newTopicClassId: string = "";
  
  newJournalTitle: string = "";
  newJournalSubTitle: string = "";
  newJournalSearchTags: string = "";

  constructor(router: Router, journalService: JournalService, userService: UserService) { 
    this.journalService = journalService;
    this.router = router;
    this.userService = userService;
    this.journalService.topicChange.subscribe((topicId: String) => {
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
  }

  //set character limit for the subtitle
  //create new journal through a modal

  ngOnInit(): void {
    let userId = this.userService.getCurrentUser()["userid"];
    let authToken = this.userService.getCurrentUser()["authToken"];
    this.retrievingPreviews = true;
    this.retrievingTopics = true;
      //TODO If user tries to go to this page immediately, look for cookies and try signing in again

    this.journalService.getTopicsByUserid(userId, authToken).subscribe(
      result => {
        if(result.length != 0) {
          this.loadRetrievedTopics(result);
          this.journalService.getJournalPreviewsByUserIdAndTopicId(userId, this.currentTopic.topicId, authToken).subscribe(
            result => {
              this.loadRetrievedPreviews(result)              
            },
            error => {
              console.log(error);
            }
          )
        }
        else {
          this.retrievingTopics = false;
          this.retrievingPreviews = false;
        }
        
      },
      error => {
        console.log(error.error);
      }
    );
    //TODO set currentTopic equal to last opened topic
    //this can be a setting under Profile to enable or disable
    this.currentTopic = this.topics[0];
    this.retrievingTopics = false;

  }

  setSelectedPreviewIndex(index: number) {
    this.currentJournalPreviewIndex = index;
    this.currentJournalPreview = this.journalPreviews[index];
    this.journalService.setCurrentJournal(this.journalPreviews[index].journalId, this.journalPreviews[index].title);
  }

  loadRetrievedTopics(result: any) {
    this.topics = [];
    result.map((topic:Topic) => {
      let newTopic: Topic = {
        topicName: topic.topicName,
        topicId: topic.topicId,
        userId: topic.userId,
        classId: topic.classId,
        color: topic.color,
        createdDate: topic.createdDate
      }
     this.topics.push(newTopic) 
    })
    this.currentTopicIndex = 0;
    this.currentTopic = this.topics[this.currentTopicIndex];
    this.journalService.setCurrentTopic(this.currentTopic.topicId, this.currentTopic.topicName);
    this.retrievingTopics = false;
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

  changeTopics(index: number) {
    if(index == this.currentTopicIndex) {
      return;
    }
    this.currentTopicIndex = index;
    this.retrievingPreviews = true;
    this.currentTopic = this.topics[index];
    this.journalService.setCurrentTopic(this.currentTopic.topicId, this.currentTopic.topicName);
    let userId = this.userService.getCurrentUser()['userid'];
    let authToken = this.userService.getCurrentUser()['authToken'];

    this.journalService.getJournalPreviewsByUserIdAndTopicId(userId, this.currentTopic.topicId, authToken).subscribe(
      result => {
        this.loadRetrievedPreviews(result);
      },
      error => {
        console.log(error);
      }
    )
    this.retrievingPreviews = false;
  }

  showNewTopicModal() {
    this.displayNewTopicModal = true;
  }

  closeNewTopicModal() {
    this.displayNewTopicModalLoadingIcon = false;
    this.displayNewTopicModal = false;
    this.newTopicClassId = "";
    this.newTopicColor = "";
    this.newTopicName = "";
  }

  createNewTopic() {
    this.creatingNewTopic = true;
    this.displayNewTopicModalLoadingIcon = true;
    let authToken = this.userService.getCurrentUser()['authToken'];
    if(this.newTopicClassId.length > 0) {
      //check for class with this id
    }
    else {
      let newTopic: Topic = {
        topicName: this.newTopicName,
        topicId: "",
        userId: this.userService.getCurrentUser()["userid"],
        color: this.newTopicColor,
        classId: this.newTopicClassId,
        createdDate: new Date()
      };
      this.journalService.createNewtopic(newTopic, authToken).subscribe(
        result => {
          newTopic.topicId = result["topicId"];
          this.journalService.setCurrentTopic(result["topicId"], result["topicName"]);
          this.topics.push(newTopic);
          this.currentTopic = newTopic;
          this.journalPreviews = [];
        },
        error => {

        }
      );
      this.closeNewTopicModal();
    }
  }

  showNewJournalModal() {
    this.displayNewJournalModal = true;
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
    this.journalService.createNewJournal(journal, authToken).subscribe(
      result => {
        this.journalService.getJournalPreviewsByUserIdAndTopicId(userId,this.journalService.getCurrentTopic(), authToken).subscribe(
          result => {
            this.loadRetrievedPreviews(result);
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
    this.newJournalTitle = "";
    this.newJournalSubTitle = "";
    this.newJournalSearchTags = "";
    this.displayNewJournalModalLoadingIcon = false;
    this.displayNewJournalModal = false;
    
  }

  closeNewJournalModal() {
    this.displayNewJournalModal = false;
    this.newJournalTitle = "";
    this.newJournalSubTitle = "";
    this.newJournalSearchTags = "";
  }
}
