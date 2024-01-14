import { Component,OnInit, EventEmitter, Input, Output, ViewChild  } from '@angular/core';
import { UtilsService } from '../../../../services/utils.service';
import { ApiService } from '../../../../services/api.service';
import { LoginService } from '../../../../services/login.service';
import { Observable } from 'rxjs';
import { Machine } from '../../../../interfaces/interfaces';
import { GridComponent } from '@progress/kendo-angular-grid';
@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent implements OnInit{
  constructor(private utilsService:UtilsService, private apiService:ApiService, private loginService:LoginService){}
  @ViewChild(GridComponent) grid: GridComponent | undefined;

  userFullname$ = this.loginService.getUserFullname();
  @Output() machinesChanged = new EventEmitter<Machine[]>();
  @Output() numberOfMachinesPerPage = new EventEmitter<number>();

  numberOfPages = [5,10,15,20]
  isPopUpButtonsOpened = false
  username : string   = ''
  warningOpen = false;
  @Input () machines: Machine[] = []
  images : any = []
  ngOnInit(): void {
    this.userFullname$.subscribe((fullName)=>{
        this.username = fullName || ''
     }) 
  }
  isModalOpened = false

  async refresh(){
    console.log(this.grid)
    const observableResult: Observable<any> = await this.apiService.getMachines(this.username);
 
    observableResult.subscribe((res) => {
     this.machines = res   
       this.machines.forEach(machine => {
         machine.purchasedatetime = this.utilsService.convertDatetimeFormat(machine.purchasedatetime);
        machine.capacity = this.utilsService.convertCapacity(machine.capacity)
       });    
         
   }   
   );


   setTimeout(async () => {
    try {
      const images: Observable<any> = await this.apiService.getImages(this.username);

      images.subscribe((res)=>{
         this.images = res
         let machinesTemp = this.utilsService.updateImages(this.machines,this.images)
         this.machines = machinesTemp
        this.machinesChanged.emit(this.machines);  
      }
      
      )
       
     } catch (error) {
      console.error('Error fetching images:', error);
    }
  }, 150);  
    

  }

  async actionsManagment(action:any, data:any){
   let updatedData =  this.utilsService.prepareEditData(data)
   let machineFields = updatedData.slice(1,7)
   const noNulls = machineFields.every(value => value !== null);
   if(noNulls){
          try {
            this.warningOpen = false
          const result: Observable<any> = await this.apiService.addMachine(this.username, updatedData);
          result.subscribe(
           async (res) => {
                let updatedMachine = res.res.result[0]
                updatedMachine.purchasedatetime = this.utilsService.convertDatetimeFormat(updatedMachine.purchasedatetime);
                updatedMachine.capacity = this.utilsService.convertCapacity(updatedMachine.capacity)
               this.machines.push(updatedMachine)
               let machineId = res.res.result[0].machineid
               const imageResult: Observable<any> = await this.apiService.addImage(this.username, updatedData,machineId);
               imageResult.subscribe((res)=>{
               let imageurl = res.result.result[1]
               let machineid = res.result.result[2]
             
               let currentMachine = this.machines.find((machine)=> machine.machineid == machineid)
               if(currentMachine && imageurl !== 'None'){
                currentMachine.imageurl = imageurl
               }
               
               })

               
            },
            (error) => {
              console.error('Error:', error);
            },
            () => {
              this.closeModal();
            }
          );
        } catch (error) {
          console.error('Error during API call:', error);
        }
         
      }else{
            this.warningOpen = true
      }
   
  }
  openAddModal(){
    this.isModalOpened = true
  }
  closeModal(){
     this.isModalOpened = false
  }

  onStatusChange($event:any){
    this.numberOfMachinesPerPage.emit($event)
  }
}
 


 