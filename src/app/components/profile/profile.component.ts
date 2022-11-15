import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

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
