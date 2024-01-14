// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import jwt from 'jsonwebtoken';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
   private subscription: Subscription
 
   loggedName: string | null = null;
   userFullname$ = this.loginService.getUserFullname();

  constructor(private loginService: LoginService, private router: Router) {
    this.subscription = this.loginService.getUserFullname().subscribe((fullName)=>{
    this.loggedName = fullName
    })
    
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<any> {
    let tokenKey = 'auth_token';
    let  finalPayloadName = ''
    const token = localStorage.getItem( tokenKey);
    if(token){
      finalPayloadName = this.loginService.decodeToken(token)
      console.log(finalPayloadName) 
    }

    if(finalPayloadName === this.loggedName ){
      return true;
    } else{
      return this.router.parseUrl('/login');
    }
  }
}
