import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }



  updateMachine(formData: any){
   
    const isValidName = formData.machinename !== undefined && formData.machinename.trim() !== '';

    const isValidCapacity = formData.capacity !== undefined && formData.capacity.trim() !== '' 
                   
                 
 
  if (!isValidCapacity) {
    return {
      valid: false,
      message: 'Machine capacity must be in the range of 0.00 to 0.99.',
      field: 'machinecapacity'
    };
  }

  if (!isValidName) {
    return {
      valid: false,
      message: 'Machine name must contain at least one letter.',
      field: 'machinename'
    };
  }

  

  return {
    valid: true,
    message: 'Both fields are valid.',
  };
}
  
    
  }
 