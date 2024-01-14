import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
 @Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  userFullname$ = this.loginService.getUserFullname();
  isPopUp = true
  isPopUpButtonsOpened = false
  constructor(private loginService: LoginService ) { }

  ngOnInit(): void {
 this.userFullname$.subscribe((fullName)=>{
  console.log(fullName) 
 })  }
 openPopUpButtons(){
    this.isPopUpButtonsOpened = !this.isPopUpButtonsOpened
 }
 onToggleButtons($event : any){
  this.isPopUpButtonsOpened = false
 }

}
