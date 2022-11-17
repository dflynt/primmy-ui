import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Figure } from 'src/app/models/Figure';
import { JournalService } from 'src/app/services/journal/journal.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { UserService } from 'src/app/services/user/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, ReplaySubject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-figures',
  templateUrl: './figures.component.html',
  styleUrls: ['./figures.component.css']
})
export class FiguresComponent implements OnInit {

  currentJournalId: string;
  selectedFigureIndex: number;
  figures: Figure[];
  retrievingFigures: boolean = false;
  displayNewFigureModal: boolean = false;
  displayFigureViewer: boolean = false;
  displayNewFigureLoadingIcon: boolean = false;
  displayFailedUploadErrorMessage: boolean = false;
  enableUploadFigureButton: boolean = false;

  imageURL: any;
  imageZoom: number = 100;
  imageZoomText: string = '100%';
  excelData: any;
  excelWorkbook: any;
  selectedExcelTabIndex: number = 0;
  excelSheets: Map<string, XLSX.WorkSheet> = new Map<string, XLSX.WorkSheet>();
  excelSheetsJSON: Map<string, any> = new Map<string, any>();

  docText: string;
  pdfURL: string;
  pdfZoon: number = 2.5;

  fileName: string = "";
  figureAsFile: File;
  figuresAsFiles: File[];

  base64FigureStrings: string[] = [];
  displayTextFile: boolean = false;
  displayImageFile: boolean = false;
  displayPDFFile: boolean = false;
  displaySpreadsheetFile: boolean = false;
  displayLoadingFigureIcon: boolean = false;

  @ViewChild('fileUpload')
  fileInput: ElementRef;

  journalService: JournalService;
  restService: RestService;
  userService: UserService;

  constructor(journalService: JournalService, userService: UserService, restService: RestService, 
              private _sanitizer: DomSanitizer) { 
    this.journalService = journalService;
    this.restService = restService;
    this.userService = userService;
  
    this.journalService.journalChange.subscribe((journalId: string) => {
      if(journalId != '') {
        this.resetFileUpload();
        this.figures = [];
        this.currentJournalId = journalId;
        this.enableUploadFigureButton = true;
        this.retrieveFigures(this.currentJournalId);
      }
      else {
        this.figures = [];
        this.enableUploadFigureButton = false;
      }
    });

    this.journalService.topicChange.subscribe((topicId: String) => {
      this.retrievingFigures = false;
      this.resetFileUpload();
      this.figures = [];
      this.currentJournalId = '';
      this.enableUploadFigureButton = false;
    });
  }

  ngOnInit(): void {
    //this.retrievingFigures = true;
  }
  
  retrieveFigures(journalId: string): void {  
    this.retrievingFigures = true;
    let authToken = this.userService.getCurrentUser()['authToken'];
    this.journalService.getFigures(journalId, authToken).subscribe(
      result => {
        this.createFigureObject(result);
        this.retrievingFigures = false;
      },
      error => {
        this.retrievingFigures = false;
      }
    );
  }

  createFigureObject(result: any) {
    //if filetype == image file like .jpg/.png then add to image array
    //when adding figure and type is .jpg/.png, populate image array
    //the HTML img tags will have their src pointing to an array
    this.figures = [];
    result.map((figure: Figure) => {
      let fileInfo = figure.fileName.split(".");
      let fileName = fileInfo[0];
      let fileType = fileInfo[1];
      let newFigure: Figure = {
        journalId: figure.journalId,
        figureId: figure.figureId,
        fileName: fileName,
        fileType: fileType,
        data: figure.data,
        imageURL: '',
        iconType: this.determineFileIcon(fileType.toLowerCase()),
      }
      this.figures.push(newFigure);
    })
  }

  setSelectedFigureIndex(index: number) {
    if(this.selectedFigureIndex != index) {
      this.selectedExcelTabIndex = 0;
    }
    this.selectedFigureIndex = index;
    this.displayFigureViewer = true;
    console.log("this.displayFigureViewer: " + this.displayFigureViewer);
    this.displayLoadingFigureIcon = true;
    let documentRegex = /doc|docx|txt|text/;
    let imageRegex = /jpg|gif|tiff|png/;
    let spreadsheetRegex = /xlx|xlsx/;

    let figure = this.figures[index];
    if(figure.fileType.toLowerCase() == 'pdf') {
      this.displayPDFFile = true;
      this.displayTextFile = false;
      this.displayImageFile = false;
      this.displaySpreadsheetFile = false;
      let f: string = this.figures[index].data;
        
      this.pdfURL = "data:application/pdf;base64," + f; 
    }

    else if(figure.fileType.toLowerCase().match(documentRegex)) {
      this.displayPDFFile = false;
      this.displayTextFile = true;
      this.displayImageFile = false;
      this.displaySpreadsheetFile = false;
      let f: string = this.figures[index].data;
      this.docText = atob(f).toString();
    }

    else if(figure.fileType.toLowerCase().match(imageRegex)) {
      this.displayPDFFile = false;
      this.displayTextFile = false;
      this.displayImageFile = true;
      this.displaySpreadsheetFile = false;
      let f: string = this.figures[index].data;
      this.imageURL = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + f);
      //send this imageURL to the journal service and add a listener in the journal class for new images. 
      //also listen for deletes
      this.imageZoom = 80;
      this.imageZoomText = "80%";
    }
    
    else if(figure.fileType.toLowerCase().match(spreadsheetRegex)) {
      this.excelSheets.clear();
      this.displaySpreadsheetFile = true;
      this.displayPDFFile = false;
      this.displayTextFile = false;
      this.displayImageFile = false;
      let f: string = this.figures[index].data;
      const wb: XLSX.WorkBook = XLSX.read(atob(f).toString(), { type: 'binary' });
      this.excelWorkbook = wb;

      /* grab first sheet */
      for(let i = 0; i < wb.SheetNames.length; i++) {
        let sheetName: string = this.excelWorkbook.SheetNames[i];
        this.excelSheets.set(this.excelWorkbook.SheetNames[i], this.excelWorkbook.Sheets[sheetName]);
        this.excelSheetsJSON.set(this.excelWorkbook.SheetNames[i], XLSX.utils.sheet_to_json(this.excelWorkbook.Sheets[sheetName], {header: 1}) );
      }
    
      const wsname: string = this.excelWorkbook.SheetNames[this.selectedExcelTabIndex];
      const ws: XLSX.WorkSheet = this.excelWorkbook.Sheets[wsname];

      /* save data */
      this.excelData = this.excelSheetsJSON.get(wsname);
    }

    this.displayLoadingFigureIcon = false;
  }

  setSelectedExcelSheetIndex(index: number): void {
    this.displayLoadingFigureIcon = true;
    this.selectedExcelTabIndex = index;
    
    let sheetName = this.excelWorkbook.SheetNames[index];
    //let data = XLSX.utils.sheet_to_json(this.excelWorkbook.Sheets[sheetName], {header: 1});
    this.excelData =  this.excelSheetsJSON.get(sheetName);
    this.displayLoadingFigureIcon = false;
    
  }

  closeFigureViewer(): void {
    this.displayFigureViewer = false;
  }

  deleteFigure(): void {
    this.displayLoadingFigureIcon = true;
    //splice works as get element at selectedFigureIndex, remove 1
    let figureId: string = this.figures[this.selectedFigureIndex].figureId;
    let authToken = this.userService.getCurrentUser()['authToken'];
    this.journalService.deleteFigure(this.currentJournalId, figureId, authToken).subscribe(
      result => {
        const deletedFigure = this.figures.splice(this.selectedFigureIndex, 1);
        this.displayFigureViewer = false;
        this.displayLoadingFigureIcon = false;
        this.selectedExcelTabIndex = 0;
      },
      error => {
        this.displayFigureViewer = false;
        this.displayLoadingFigureIcon = false;
      }
    );
  }

  showNewFigureModal(): void {
    if(this.enableUploadFigureButton) {
      this.displayNewFigureModal = true;
    }
  }

  determineFileIcon(fileType: string): string {
    let iconType = "description";
    switch(fileType) {
      case "pdf":
        iconType = "library_books";
        break;
      case "xls":
      case "xlsx":
        iconType = "assessment";
        break;
      case "doc":
      case "docx":
      case "txt":
        iconType = "description";
        break;
      default:
        iconType = "insert_photo";
        break;      
    }

    return iconType;
  }

  showUploadErrorMessage(error: Error) {
    this.displayNewFigureLoadingIcon = false;
    this.displayFailedUploadErrorMessage = true;
  }

  onFileSelect(event: any): void {
    this.figuresAsFiles = event.target.files;
    for(let i = 0; i < this.figuresAsFiles.length; i++) {
      this.convertFile(this.figuresAsFiles[i]).subscribe(base64 => {
        this.base64FigureStrings.push(base64);
      });
    }
  }

  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    console.log(file.name);
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event!.target!.result!.toString()));
    return result;
  }

  attemptSave(): void {
    this.journalService.uploadFigures(this.figuresAsFiles, 
                                      this.journalService.getCurrentJournalId(), 
                                      this.userService.getCurrentUser()['authToken'])
                                      .subscribe(
                                          result => {
                                            this.retrieveFigures(this.journalService.getCurrentJournalId());
                                            this.closeNewFigureModal();
                                          },
                                          error => {
                                            console.log(error);
                                            this.showUploadErrorMessage(error);
                                          }
                                        )
  }

  closeNewFigureModal(): void {
    this.retrievingFigures = false;
    this.displayNewFigureModal = false;
    this.displayNewFigureLoadingIcon = false;
    this.displayFailedUploadErrorMessage = false;
    this.figuresAsFiles = [];
    this.base64FigureStrings = [];
    this.resetFileUpload();
  }  

  resetFileUpload() {
    this.fileInput.nativeElement.value = "";
  }

  increasePdfZoom() {
    this.pdfZoon += .5;
  }

  decreasePdfZoom() {
    this.pdfZoon -= .5;
  }

  /*
  increaseImageZoom() {
    if(this.imageZoom < 80) {
      this.imageZoom += 20;
      this.imageZoomText = this.imageZoom + '%';
    }
  }

  decreaseImageZoom() {
    if(this.imageZoom > 20) {
      this.imageZoom -= 20;
      this.imageZoomText = this.imageZoom + '%';
    }
  }
  */
}
