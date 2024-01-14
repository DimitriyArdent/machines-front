import { Injectable } from '@angular/core';
 import { HttpClient,HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, Subject,BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private tokenKey = 'auth_token';

  private backendUrl = 'http://127.0.0.1:5000';  
   
  private loggedNameSubject = new BehaviorSubject<string | null>(null);
  LoggedName$2 = this.loggedNameSubject.asObservable();
  loggedName :string =''
  constructor(private http: HttpClient, private router: Router) { }


  decodeToken(token:string){
    let constbase64url =token.split('.')[1];
    const base64 = constbase64url.replace(/-/g,'+').replace(/_/g,'/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map((c)=>{
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join('')
    )
     const finalPayload = JSON.parse(jsonPayload)
     return finalPayload.identity
  }






  loginUser(data: any): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    
    return this.http.post(`${this.backendUrl}/account/login`, data, {headers} )
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            this.loggedName = response.full_name
            const fullName = response.full_name
            this.loggedNameSubject.next(fullName);
           }
        })
       );
  }

   logoutuser(userName:string){
        if(userName === this.loggedName){
          this.loggedNameSubject.next('');
          this.router.navigateByUrl('/login');

        }
   }
  








  getUserFullname():  Observable<string | null> {
    return this.LoggedName$2;
  }

  async isAuthenticated():  Promise<any> {
    
    try {
        const token = localStorage.getItem(this.tokenKey);
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        })
    let res =  await this.http.get(`${this.backendUrl}/account/tokenVerification`, {headers} ).toPromise()
     return res
    } catch (error) {
      return false
    }
  
   }

 }
 
