import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Figure } from 'src/app/models/Figure';
import { JournalService } from 'src/app/services/journal/journal.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { UserService } from 'src/app/services/user/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, ReplaySubject } from 'rxjs';
import { v4 as uuid } from 'uuid';

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
      this.resetFileUpload();
      this.figures = [];
      this.currentJournalId = journalId;
      this.enableUploadFigureButton = true;
      this.retrieveFigures(this.currentJournalId);
      console.log("upload figure btn: " + this.enableUploadFigureButton);
    });

    this.journalService.topicChange.subscribe((topicId: String) => {
      this.retrievingFigures = false;
      this.resetFileUpload();
      this.figures = [];
      this.currentJournalId = '';
      this.enableUploadFigureButton = false;
      console.log("upload figure btn: " + this.enableUploadFigureButton);
    });
  }

  ngOnInit(): void {
    this.retrievingFigures = true;
  }
  
  retrieveFigures(journalId: string): void {  
    this.retrievingFigures = true;
    let authToken = this.userService.getCurrentUser()['authToken'];
    this.journalService.getFigures(journalId, authToken).subscribe(
      result => {
        console.log(result);
        this.createFigureObject(result);
        this.retrievingFigures = false;
      },
      error => {
        console.log(error);
        this.retrievingFigures = false;
      }
    );
  }

  createFigureObject(result: any) {
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
    this.selectedFigureIndex = index;
    this.displayLoadingFigureIcon = true;
    let documentRegex = /doc|docx|txt|text/;
    let imageRegex = /jpg|gif|tiff|png/;

    console.log("Selected figure index: " + this.selectedFigureIndex);
    let figure = this.figures[index];
    if(figure.fileType.toLowerCase() == 'pdf') {
      this.displayPDFFile = true;
      this.displayTextFile = false;
      this.displayImageFile = false;
      let f: string = this.figures[index].data;
        
      this.pdfURL = "data:application/pdf;base64," + f; 
    }

    else if(figure.fileType.toLowerCase().match(documentRegex)) {
      this.displayPDFFile = false;
      this.displayTextFile = true;
      this.displayImageFile = false;
      let f: string = this.figures[index].data;
      this.docText = atob(f).toString();
    }

    else if(figure.fileType.toLowerCase().match(imageRegex)) {
      this.displayPDFFile = false;
      this.displayTextFile = false;
      this.displayImageFile = true;
      let f: string = this.figures[index].data;
      this.imageURL = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + f);
      this.imageZoom = 80;
      this.imageZoomText = "80%";
    }

    this.displayFigureViewer = true;
    this.displayLoadingFigureIcon = false;
  }

  closeFigureViewer(): void {
    this.displayFigureViewer = false;
  }

  deleteFigure(): void {
    this.displayLoadingFigureIcon = true;
    //splice works as get element at selectedFigureIndex, remove 1
    console.log("Deleting... Selected figure index: " + this.selectedFigureIndex);
    let figureId: string = this.figures[this.selectedFigureIndex].figureId;
    let authToken = this.userService.getCurrentUser()['authToken'];
    this.journalService.deleteFigure(this.currentJournalId, figureId, authToken).subscribe(
      result => {
        const deletedFigure = this.figures.splice(this.selectedFigureIndex, 1);
        this.displayFigureViewer = false;
        this.displayLoadingFigureIcon = false;
      },
      error => {
        this.displayFigureViewer = false;
        this.displayLoadingFigureIcon = false;
      }
    );
  }

  showNewFigureModal(): void {
    this.displayNewFigureModal = true;
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

  /*addFilesToFigureList(): void {
    for(let i = 0; i < this.figuresAsFiles.length; i++) {
      let f: File = this.figuresAsFiles[i];
      let fileInfo = f.name.split(".");
      let fileName = fileInfo[0];
      let fileType = fileInfo[1];
      let newFigure: Figure = {
        journalId: this.journalService.getCurrentJournalId(),
        figureId: uuid(),
        fileName: fileName,
        fileType: fileType,
        data: this.base64FigureStrings[i],
        imageURL: '',
        iconType: this.determineFileIcon(fileType.toLowerCase()),
      }
      this.figures.push(newFigure);
    }
  }
  */

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
