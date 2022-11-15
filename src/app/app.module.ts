import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CalendarModule} from 'primeng/calendar';
import { ReactiveFormsModule } from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import { AppRoutingModule } from './app-routing.module';
import {OrderListModule} from 'primeng/orderlist';
import {ListboxModule} from 'primeng/listbox';
import { EditorModule } from '@tinymce/tinymce-angular';
import {MatIconModule} from '@angular/material/icon'
import {TabViewModule} from 'primeng/tabview';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";


import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FooterComponent } from './components/footer/footer.component';
import { JournalComponent } from './components/journal/journal.component';
import { JournalentriesComponent } from './components/journalentries/journalentries.component';
import { FiguresComponent } from './components/figures/figures.component';
import { JournalHeaderComponent } from './components/journal-header/journal-header.component';
import { VerifyComponent } from './components/verify/verify.component';
import { CookieService } from 'ngx-cookie-service';
import {Interceptor} from './interceptors/interceptor';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProfileComponent } from './components/profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    FooterComponent,
    JournalComponent,
    JournalentriesComponent,
    FiguresComponent,
    JournalHeaderComponent,
    VerifyComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    InputTextModule,
    BrowserAnimationsModule,
    RadioButtonModule,
    CalendarModule,
    ReactiveFormsModule,
    DialogModule,
    OrderListModule,
    ListboxModule,
    EditorModule,
    MatIconModule,
    PdfViewerModule,
    TabViewModule,
    InfiniteScrollModule
    ],
  providers: [CookieService, {provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true} ],
  bootstrap: [AppComponent]
})
export class AppModule { }


