import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Journal } from 'src/app/models/Journal';
import { Workbook } from 'src/app/models/Workbook';
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
  private currentWorkbookId: string;
  private currentWorkbookName: string;
  private currentWorkbookColor: string;
  messageSource: Subject<String> = new Subject<String>();
  messagesChanges = this.messageSource.asObservable();

  workbookSource: Subject<String> = new Subject<String>();
  workbookChange = this.workbookSource.asObservable();

  workbookColorSource: Subject<string> = new Subject<string>();
  workbookColorchange = this.workbookColorSource.asObservable();

  previewSource: Subject<any[]> = new Subject<any>();
  previewchange = this.previewSource.asObservable();

  journalSource: Subject<string> = new Subject<string>();
  journalChange = this.journalSource.asObservable();
  
  journalTitleSource: Subject<any> = new Subject<any>();
  journalTitlechange = this.journalTitleSource.asObservable();

  constructor(private rest: RestService) { }

  getWorkbooksByUserid(userId: String, authToken: String): Observable<any> {
    return this.rest.get("/workbooks/user/" + userId, this.journalPortNumber, null, authToken);
  }
  
  getJournalPreviewsByUserIdAndTopicId(userId: string, topicId: string, authToken: string): Observable<any>{
    return this.rest.get("/journal/preview/user/" + userId + "/workbook/" + topicId, this.journalPortNumber, null, authToken);
  }

  createNewWorkbook(newWorkbook: Workbook, authToken: string): Observable<any> {
    return this.rest.post("/workbooks/createWorkbook", this.journalPortNumber, newWorkbook, authToken);
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
    console.log("Deleting journalId: " + journalId);
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

  getCurrentWorkbook(): string {
    return this.currentWorkbookId;
  }

  getCurrentWorkbookName(): string {
    return this.currentWorkbookName;
  }

  setCurrentWorkbook(topicId: string, topicName: string, topicColor: string ) {
    this.currentWorkbookName = topicName;
    this.currentWorkbookId = topicId;
    this.currentWorkbookColor = topicColor;
    //if switching topics, current journal is unselected
    this.currentJournalTitle = "";
    this.currentJournalSubtitle = "";
    this.workbookSource.next(topicId);
    this.workbookColorSource.next(topicColor);
  }

  getCurrentWorkbookColor(): string {
    return this.currentWorkbookColor;
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

