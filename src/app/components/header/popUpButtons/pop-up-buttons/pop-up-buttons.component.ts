import { Component, Input, Output, EventEmitter  } from '@angular/core';
import {   Router } from '@angular/router';
import { LoginService } from '../../../../services/login.service';
@Component({
  selector: 'popUpButtons',
  templateUrl: './pop-up-buttons.component.html',
  styleUrl: './pop-up-buttons.component.css'
})
export class PopUpButtonsComponent {
constructor(private router:Router,private loginService: LoginService){}
userFullname$ = this.loginService.getUserFullname();
loggedName :string = ''
isOpened = true
  isOpen = true
  @Input() isPopUpButtonsOpened: boolean | undefined;
  @Output() toggleButtons = new EventEmitter<boolean>();
  ngOnInit(): void {
 this.userFullname$.subscribe((fullName)=>{
   this.loggedName = fullName || ''
 })  }

  redirectToHome(){
    this.toggleButtons.emit(!this.isPopUpButtonsOpened);
       this.router.navigateByUrl('/home')
   }

  logout(){
     this.toggleButtons.emit(!this.isPopUpButtonsOpened);
       this.loginService.logoutuser(this.loggedName)
  }
}
