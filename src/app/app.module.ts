import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
 import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { SampleComponent } from './components/sample/sample.component';
import { HeaderComponent } from './components/header/header.component';
import { ManagmentComponent } from './components/managment/managment.component';
import {GridModule} from '@progress/kendo-angular-grid'
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { EditComponent } from './components/managment/edit/edit/edit.component';
 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
 import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
 import { PopupService, PopupRef } from '@progress/kendo-angular-popup';
import { PopUpButtonsComponent } from './components/header/popUpButtons/pop-up-buttons/pop-up-buttons.component';
import { ToolbarComponent } from './components/managment/toolbar/toolbar/toolbar.component';
 
  @NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SampleComponent,
    HeaderComponent,
    ManagmentComponent,
    EditComponent,
    PopUpButtonsComponent,
    ToolbarComponent 
     
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    BrowserAnimationsModule,
    DropDownListModule,
    DateInputsModule,
    GridModule,
      HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
