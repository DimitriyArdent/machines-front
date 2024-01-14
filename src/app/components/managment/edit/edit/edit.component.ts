 import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Machine } from '../../../../interfaces/interfaces';
import { ValidationService } from '../../../../services/validation.service';
import { UtilsService } from '../../../../services/utils.service';
import { ApiService } from '../../../../services/api.service';
import { Observable } from 'rxjs/internal/Observable';
import { LoginService } from '../../../../services/login.service';
@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  constructor(private validationService: ValidationService, private utilsService : UtilsService, private apiService:ApiService, private loginService:LoginService ){}
  selectedDateTime: Date | null = new Date();
  selectedYearTime: Date | null = new Date();
  years: number[] = [];
  capacity:any[] =[];
  manufacturerIds: any;
  status:number[] = [0,1];
  userFullname$ = this.loginService.getUserFullname();
  currentName = ''
  errors: any
   formData: any = {}; // Object to hold form data
  @Input() currentMachine?: Machine;
  @Output() closeEvent = new EventEmitter<void>();
  machine?: Machine;
  @Output() editData = new EventEmitter<any>();
  isDatePickerOpen = false
  isYearPickerOpen = false
  isStatusOpen = false
  isManufacturerOpen = false
  isCapacityOpen = false
  capacityError = false
  onCloseButtonClick() {
    this.validationService
    this.closeEvent.emit();
 }

 async ngOnInit(): Promise<any> {
  this.userFullname$.subscribe((fullName)=>{
    this.currentName = fullName ?? 'noname'
    }) 
   const observableResult: any = await this.apiService.getUniqueMnufacturerIds(this.currentName);
   this.manufacturerIds = observableResult.result
   this.machine = this.currentMachine
   this.years = this.utilsService.generateYearRange(1980,2024)
   this.capacity = this.utilsService.generateCapacityRange()
 }

 onSubmitClick(): void {
       
       let machineid = this.machine?.machineid
       this.formData.machineid = machineid
       this.editData.emit(this.formData );
       this.closeEvent.emit();
  
  
}
openDatePicker():void{
this.isDatePickerOpen = true
}
closeDatePicker():void{
  this.isDatePickerOpen = false
  }
openYearPicker():void{
  this.isYearPickerOpen = true
}
closeYearPicker():void{
  this.isYearPickerOpen = false
}
openStatusPicker():void{
  this.isStatusOpen = true
}
closeStatusPicker():void{
  this.isStatusOpen = false
}
openManufacturerIdPicker():void{
  this.isManufacturerOpen = true
}
closeManufacturerIdPicker():void{
  this.isManufacturerOpen = false
}
openCapacityPicker():void{
  this.isCapacityOpen = true
}
closeCapacityPicker():void{
  this.isCapacityOpen = false
}

onDateTimePickerValueChange(value: Date): void {

   this.formData.purchasedatetime = value
   this.isDatePickerOpen = false
}
onYearPickerValueChange(value: Date): void {

  this.formData.yearofmanufacture = value
  this.isYearPickerOpen = false
}

onStatusChange(value: number){
  this.formData.machinestatus = value
  this.isStatusOpen = false
}
onManufacturerIdChange(value: Date): void {

  this.formData.manufacturerid = value
  this.isManufacturerOpen = false
}
onCapacityChange(value: Date): void {

  this.formData.capacity = value
  this.isCapacityOpen = false
}
 
}






  