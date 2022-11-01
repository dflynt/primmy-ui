import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Journal } from 'src/app/models/Journal';
import { Topic } from 'src/app/models/Topic';
import { RestService } from '../rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class JournalService {

  journalPortNumber: string = "9999";
  private currentJournalId: string;
  private currentJournalTitle: string;
  private currentTopicId: string;
  private currenttopicName: string;
  private currentTopicColor: string;
  messageSource: Subject<String> = new Subject<String>();
  messagesChanges = this.messageSource.asObservable();

  topicSource: Subject<String> = new Subject<String>();
  topicChange = this.topicSource.asObservable();

  topicColorSource: Subject<string> = new Subject<string>();
  topicColorchange = this.topicColorSource.asObservable();

  previewSource: Subject<any[]> = new Subject<any>();
  previewchange = this.previewSource.asObservable();

  journalSource: Subject<string> = new Subject<string>();
  journalChange = this.journalSource.asObservable();

  constructor(private rest: RestService) { }

  getTopicsByUserid(userId: String, authToken: String): Observable<any> {
    return this.rest.get("/topics/user/" + userId, this.journalPortNumber, null, authToken);
  }
  
  getJournalPreviewsByUserIdAndTopicId(userId: string, topicId: string, authToken: string): Observable<any>{
    return this.rest.get("/journal/preview/user/" + userId + "/topic/" + topicId, this.journalPortNumber, null, authToken);
  }

  createNewtopic(newTopic: Topic, authToken: string): Observable<any> {
    return this.rest.post("/topics/createTopic", this.journalPortNumber, newTopic,  authToken);
  }

  getJournalDataByJournalId(userId: string, journalId: string, authToken: string) {
    return this.rest.get("/journal/" + journalId, this.journalPortNumber, null, authToken);
  }

  createNewJournal(newJournal: Journal, authToken: string): Observable<any> {
    return this.rest.post("/journal/createJournal/", this.journalPortNumber, newJournal, authToken);
  }

  saveJournal(existingJournal: Journal, authToken: string): Observable<any> {
    return this.rest.patch("/journal/" + existingJournal.journalId, this.journalPortNumber, existingJournal, authToken);
  }

  getCurrentJournalId(): string {
    return this.currentJournalId;
  }

  getCurrentJournalTitle(): string {
    return this.currentJournalTitle
  }

  setCurrentJournal(journalId: string, journalName: string) {
    this.currentJournalTitle = journalName;
    this.currentJournalId = journalId;
    this.journalSource.next(journalId);
  }

  displayRetrievedPreviews(previews: any[]) {
    this.previewSource.next(previews);
  }

  getCurrentTopic(): string {
    return this.currentTopicId;
  }

  getCurrentTopicName() : string {
    return this.currenttopicName;
  }

  setCurrentTopic(topicId: string, topicName: string, topicColor: string ) {
    this.currenttopicName = topicName;
    this.currentTopicId = topicId;
    this.currentTopicColor = topicColor;
    console.log("Service... currentTopic: " + this.currentTopicColor);
    //if switching topics, current journal is unselected
    this.currentJournalTitle = "";
    this.topicSource.next(topicId);
    this.topicColorSource.next(topicColor);
  }

  getCurrentTopicColor(): string {
    return this.currentTopicColor;
  }

  getFigures(journalId: string, authToken: string): Observable<any> {
    return this.rest.get("/journal/" + journalId + "/figures", this.journalPortNumber, null, authToken)
  }

  uploadFigures(figures: File[], journalId: string, authToken: string): Observable<any> {
    let formParams = new FormData();
    for(let figure of figures) {
      formParams.append('files', figure);
    }
    console.log(figures);
    console.log(formParams);
    return this.rest.postImages('/journal/' + journalId + '/uploadFigures', this.journalPortNumber, formParams, authToken);
  }

  deleteFigure(journalId: string, figureId: string, authToken: string): Observable<any> {
    return this.rest.delete("/journal/" + journalId + "/figure/" + figureId, this.journalPortNumber, null, authToken);
  }
}
