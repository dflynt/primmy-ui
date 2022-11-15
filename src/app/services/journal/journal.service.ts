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
  private currentJournalTitlePlaceholder: string;
  private currentJournalSubtitle: string;
  private currentJournalSubtitlePlaceholder: string;
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
  
  journalTitleSource: Subject<any> = new Subject<any>();
  journalTitlechange = this.journalTitleSource.asObservable();

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

  saveJournalText(existingJournal: Journal, authToken: string): Observable<any> {
    return this.rest.put("/journal/" + existingJournal.journalId + "/updateText", this.journalPortNumber, existingJournal.entry, authToken);
  }

  updateJournal(journalId: string, params: any, authToken: string): Observable<any> {
    return this.rest.put("/journal/" + journalId, this.journalPortNumber, params, authToken);
  }

  deleteJournal(journalId: string, authToken: string): Observable<any> {
    return this.rest.delete("/journal/" + journalId, this.journalPortNumber, null, authToken);
  }

  removeJournalFromEntryList() {
    this.currentJournalTitle = '';
    this.currentJournalSubtitle = '';
    this.currentJournalId = '';
    this.journalSource.next('');
  }

  getCurrentJournalId(): string {
    return this.currentJournalId;
  }

  getCurrentJournalTitle(): string {
    return this.currentJournalTitle
  }

  getCurrentJournalSubtitle(): string {
    return this.currentJournalSubtitle;
  }

  getCurrentJournalTitlePlaceholder(): string {
    return this.currentJournalTitlePlaceholder;
  }

  getCurrentJournalSubtitlePlaceholder(): string {
    return this.currentJournalSubtitlePlaceholder;
  }

  setCurrentJournal(journalId: string, journalTitle: string, journalSubtitle: string) {
    this.currentJournalTitle = journalTitle;
    this.currentJournalSubtitle = journalSubtitle?.length > 0 ? journalSubtitle : "";

    this.currentJournalTitlePlaceholder = this.currentJournalTitle;
    this.currentJournalSubtitlePlaceholder = this.currentJournalSubtitle;
    this.currentJournalId = journalId;
    this.journalSource.next(journalId);
  }

  updateJournalTitle(params: any) {
    this.currentJournalTitle = params.updatedTitle;
    this.currentJournalTitlePlaceholder = this.currentJournalTitle;
    
    this.currentJournalSubtitle = params.updatedSubtitle;
    this.currentJournalSubtitlePlaceholder = this.currentJournalSubtitle;
    
    this.journalTitleSource.next(params);
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
    //if switching topics, current journal is unselected
    this.currentJournalTitle = "";
    this.currentJournalSubtitle = "";
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
    return this.rest.postImages('/journal/' + journalId + '/uploadFigures', this.journalPortNumber, formParams, authToken);
  }

  deleteFigure(journalId: string, figureId: string, authToken: string): Observable<any> {
    return this.rest.delete("/journal/" + journalId + "/figure/" + figureId, this.journalPortNumber, null, authToken);
  }
}

