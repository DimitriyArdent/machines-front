import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable, Subject, Timestamp } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginService } from './login.service';
import { startWith } from 'rxjs/operators';
import { Machine } from '../interfaces/interfaces';
@Injectable({
  providedIn: 'root'
})
export class UtilsService   {
  constructor( ) {}
     

   
  convertDatetimeFormat(datetimeString: string): string {
    const date = new Date(datetimeString);
    const year = date.getFullYear() 
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
  
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }

  prepareEditData(machine : Machine){
    let editValues = []
    editValues.push(machine.machineid ? machine.machineid : null)
    editValues.push(machine.machinename ? machine.machinename : null)
    editValues.push(machine.manufacturerid ? machine.manufacturerid : null)
    editValues.push(machine.purchasedatetime ? machine.purchasedatetime : null)
    editValues.push(machine.yearofmanufacture ? machine.yearofmanufacture : null)
    editValues.push(machine.machinestatus !== undefined ? machine.machinestatus : null)
    editValues.push(machine.capacity ?   machine.capacity  : null)
    editValues.push(machine.imageurl ?   machine.imageurl  : null)

     
    return editValues
  }

  generateYearRange(startYear: number, endYear: number): number[] {
    const years: number[] = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  }

  generateCapacityRange( ){
    const array = [];

    for (let i = 1; i <= 100; i++) {
      const value = i / 100;
      array.push(value.toFixed(2));
    }
  
    return array;
  }
  

  convertCapacity(capacity:any){
    const number = parseFloat(capacity);

    if (!isNaN(number) && number >= 0 && number <= 1) {
      const percentage = (number * 100).toFixed(0);
      return `${percentage}%`;
    } else {
      return 'Invalid input. Please provide a number between 0 and 1.';
    }
  } 


 



  updateImages(machines :any , images: any) {
     const updatedMachines = [];
  
    for (let i = 0; i < machines.length; i++) {
      const machine = { ...machines[i] };  
      const matchingImage = images.find((img:any) => img.machineid === machine.machineid);
  
      if (matchingImage) {
         machine.imageurl = matchingImage.imageurl;
      }
      else{
        machine.imageurl = '../../../assets/machine.jpeg'
      }
  
       updatedMachines.push(machine);
    }
  
    return updatedMachines;
  }

}
