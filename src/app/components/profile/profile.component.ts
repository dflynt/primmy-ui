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

  saveUpdatedUserData(updatedField: string): void {
    console.log("updated field: " + updatedField);
    console.log("Saving new user info");
    console.log(this.userService.getCurrentUser());
  }

  showFirstNameInput(): void {
    this.editFirstNameInputEnabled = true;
  }

  closeFirstNameInput(): void {
    this.editFirstNameInputEnabled = false;
  }

  showLastNameInput(): void {
    this.editLastNameInputEnabled = true;
  }

  closeLastNameInput(): void {
    this.editLastNameInputEnabled = false;
  }

  showInstitutionInput(): void {
    this.editInstitutionInputEnabled = true;
  }

  closeInstitutionInput(): void {
    this.editInstitutionInputEnabled = false;
  }

  showFieldInput(): void {
    this.editFieldInputEnabled = true;
  }

  closeFieldInput(): void {
    this.editFieldInputEnabled = false;
  }

  showFocusInput(): void {
    this.editFocusInputEnabled = true;
  }

  closeFocusInput(): void {
    this.editFocusInputEnabled = false;
  }
}
