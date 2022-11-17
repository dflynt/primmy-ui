import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  formBuilder: FormBuilder = new FormBuilder();
  userService: UserService;

  editFirstNameInputEnabled: boolean = false;
  editLastNameInputEnabled: boolean  = false;
  editInstitutionInputEnabled: boolean = false;
  editFieldInputEnabled: boolean = false;
  editFocusInputEnabled: boolean = false;

  editedFirstName: string = "";
  editedLastName: string = "";
  editedInstitution: string = "";
  editedField: string = "";
  editedFocus: string = "";

  displaySubmitErrorModal: boolean = false;
  displaySuggestionModal: boolean = false;

  constructor(formBuilder: FormBuilder, userService: UserService) {
    this.userService = userService;
    this.formBuilder = formBuilder;
  }

  editUserForm = this.formBuilder.group({
    first: new FormControl(''),
    last: new FormControl(''),
    inst: new FormControl(''),
    fieldCtrl: new FormControl(''),
    focusCtrl: new FormControl('')
  })

  submitUserEdits(): void {
    
  }

  ngOnInit(): void {
  }

  attemptErrorSubmission(): void {

  }

  attemptSuggestionSubmission(): void {

  }

  showSubmitErrorModal(): void {
    this.displaySubmitErrorModal = true;
  }
  closeSubmitErrorModal(): void {
    this.displaySubmitErrorModal = false;
  }


  showSuggestionModal(): void { 
    this.displaySuggestionModal = true;
  }
  closeSuggestionModal(): void {
    this.displaySuggestionModal = false;
  }

  saveUpdatedFirstName(): void {
    console.log("Saving updated first name");
    console.log(this.userService.getCurrentUser());
    this.editedFirstName = "";
  }
  closeFirstNameInput(): void {
    this.editFirstNameInputEnabled = false;
    this.editedFirstName = "";
  }


  saveUpdatedLastName(): void {
    console.log("Saving updated last name");
    console.log(this.userService.getCurrentUser());
    this.editedLastName = "";
  }
  closeLastNameInput(): void {
    this.editLastNameInputEnabled = false;
    this.editedLastName = "";
  }


  saveUpdatedInstitutionName(): void {
    console.log("Saving updated institution");
    console.log(this.userService.getCurrentUser());
    this.editedInstitution = "";
  }
  closeInstitutionInput(): void {
    this.editInstitutionInputEnabled = false;
    this.editedInstitution = "";
  }


  saveUpdatedFieldName(): void {
    console.log("Saving updated field");
    console.log(this.userService.getCurrentUser());
    this.editedField = "";
  }
  closeFieldInput(): void {
    this.editFieldInputEnabled = false;
    this.editedField = "";
  }


  saveUpdatedFocusName(): void {
    console.log("Saving updated focus");
    console.log(this.userService.getCurrentUser());
    this.editedFocus = "";
  }
  closeFocusInput(): void {
    this.editFocusInputEnabled = false;
    this.editedFocus = "";
  }


  showFirstNameInput(): void {
    this.editFirstNameInputEnabled = true;
  }
  showLastNameInput(): void {
    this.editLastNameInputEnabled = true;
  }
  showInstitutionInput(): void {
    this.editInstitutionInputEnabled = true;
  }
  showFieldInput(): void {
    this.editFieldInputEnabled = true;
  }
  showFocusInput(): void {
    this.editFocusInputEnabled = true;
  }
}
