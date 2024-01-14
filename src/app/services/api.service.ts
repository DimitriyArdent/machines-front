import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginService } from './login.service';
import { startWith } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
 
@Injectable({
  providedIn: 'root'
})
export class ApiService   {
  constructor(private http: HttpClient, private LoginService:LoginService) {
     

   }


 


  private backendUrl = 'http://127.0.0.1:5000';  
  private tokenKey = 'auth_token';

async deleteMachine(id:number, username:string  ){
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    try {
       const res =   await  this.http.post(`${this.backendUrl}/machines/delete_machine`,{"username":username, "machine_id":id },{ headers }).toPromise()
           return res as HttpResponse<any>
    } catch (error) {
           return error
    }  
   }


  async getMachines(username : string):  Promise<Observable<any>> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
      return this.http.post(`${this.backendUrl}/machines`,{"username":username }, {headers })
      .pipe(
        tap((response: any) => {        
            console.log(response)
        })
       );   
   }
   async getImages(username : string):  Promise<Observable<any>> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
      return this.http.post(`${this.backendUrl}/machines/images`,{"username":username }, {headers })
      .pipe(
        tap((response: any) => {        
            console.log(response)
        })
       );   
   }




 
 
   async addMachine(username:string, machine : any ):  Promise<Observable<any>> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

   let macinevalues = machine.slice(1,7)
   let imageurl = machine[7]
   // response.res.result[0].machineid


      return this.http.post(`${this.backendUrl}/machines/add_machine`,{"username":username, "machine":machine }, {headers })
      .pipe(
        tap((response: any) => {   
       

         })
       );   
   }
   async addImage(username:string, machine : any, machineid:any ):  Promise<Observable<any>> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    let imageurl = machine[7]
   // response.res.result[0].machineid
    const imageTableValues =      [imageurl ,  machineid]
   return this.http.post(`${this.backendUrl}/machines/update_image`,{"username":username, "imageTableValues": imageTableValues }, {headers })
   .pipe(
     tap((response: any) => {   
          console.log(response)

      })
    );   
       
         
   }



 
   
   async updateMachine(username:string, editedValues: any) {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    const machineTableValues = editedValues.slice(0, 7);
    const imageTableValues =      [editedValues[7] ,  editedValues[0]]  ;
  
    try {
      const responses = await forkJoin([
        this.http.post(`${this.backendUrl}/machines/update_machine`, {"username":username, "editedValues": machineTableValues }, { headers }),
        imageTableValues[0] !== null
        ? this.http.post(`${this.backendUrl}/machines/update_image`, {"username":username, "imageTableValues": imageTableValues }, { headers })
        : of(null) 
      ]).toPromise();
  
      const [machineResponse, imageResponse] = responses as [any, any];
  
      // Process the responses if needed
      console.log('Machine Response:', machineResponse);
      console.log('Image Response:', imageResponse);
  
      return { machineResponse, imageResponse };
    } catch (error) {
      return { error };
    }
  }
  
 

 
  async getUniqueMnufacturerIds(username : string): Promise<any>{
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    try {
       const res =   await  this.http.post(`${this.backendUrl}/machines/manufacturerIds`,{ "username": username },{ headers }).toPromise()
         
  
           return res  
    } catch (error) {
           return error
    }  
  }
 

 


 

async searchNames(fieldName: string, searchParams: string, username: string  ){
  const token = localStorage.getItem(this.tokenKey);
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })
  try {
     const res =   await  this.http.post(`${this.backendUrl}/machines/filterNames`, {"username": username,"searchParams": searchParams},{ headers }).toPromise()
         return res as HttpResponse<any>
  } catch (error) {
         return error
  }  
 }
 async order( $event: any, username: string  ){
  const token = localStorage.getItem(this.tokenKey);
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })
  try {
     const res =   await  this.http.post(`${this.backendUrl}/machines/order`, {"username": username,"searchParams": $event},{ headers }).toPromise()
         return res as HttpResponse<any>
  } catch (error) {
         return error
  }  
 }



  

 async searchManufacturer(  searchParams: number, username: string  ){
  const token = localStorage.getItem(this.tokenKey);
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })
  try {
     const res =   await  this.http.post(`${this.backendUrl}/machines/filterManufacturerId`, {"username": username,"searchParams": searchParams},{ headers }).toPromise()
         return res as HttpResponse<any>
  } catch (error) {
         return error
  }  
 }
 async searchStatus(  searchParams: number, username: string  ){
  const token = localStorage.getItem(this.tokenKey);
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })
  try {
     const res =   await  this.http.post(`${this.backendUrl}/machines/filterStatus`, {"username": username,"searchParams": searchParams},{ headers }).toPromise()
         return res as HttpResponse<any>
  } catch (error) {
         return error
  }  
 }
  
  
}

 