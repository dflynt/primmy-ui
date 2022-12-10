import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { JournalComponent } from './components/journal/journal.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/signup/signup.component';
import { VerifyComponent } from './components/verify/verify.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { NewPasswordInputComponent } from './components/new-password-input/new-password-input.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'journal', component: JournalComponent},
  {path: 'verify/:userid/:verificationCode', component: VerifyComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'passwordReset', component: PasswordResetComponent},
  {path: 'createNewPassword/:userid', component: NewPasswordInputComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
