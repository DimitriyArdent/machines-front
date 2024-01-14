import { Component, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs/internal/Observable';
import { Machine } from '../../interfaces/interfaces';
import { UtilsService } from '../../services/utils.service';
import { LoginService } from '../../services/login.service';
import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { FilterDescriptor, CompositeFilterDescriptor    } from '@progress/kendo-data-query';

 @Component({
  selector: 'app-managment',
  templateUrl: './managment.component.html',
  styleUrl: './managment.component.css'
})
export class ManagmentComponent implements OnInit {
  constructor(private route: ActivatedRoute, private apiService:ApiService, 
    private utilsService:UtilsService, private loginService:LoginService,private cdr: ChangeDetectorRef) { }
    @ViewChild('myGrid', { static: false }) myGrid: GridComponent | undefined;

    private currentName =''
   machines: Machine[] = []; 
   manufacturerIds: any;

  images:any
  userFullname$ = this.loginService.getUserFullname();
  machinesPerPage = 5
  isDeleteModalOpen = false
  isDeleteConfirmed = false
  toBeDeletedId = -1
  isEditVisible = false;
  currentMachine: Machine = {
    machineid: 0,
    capacity: '',
    machinename: '',
    machinestatus: 0,
    manufacturerid: 0,
    purchasedatetime: '',
    yearofmanufacture: 0,
    imageurl:''
  };


  

  handleMachinesChanged(refreshedMachines: Machine[]): void {
    this.machines = [...refreshedMachines];
  } 
  
  mchPerPage(machinesPerPage:number){
    this.machinesPerPage = machinesPerPage
     
  }
  async ngOnInit(): Promise<any> {
     let username = this.route.snapshot.queryParams['username'];
      
     const manufacturersId: any = await this.apiService.getUniqueMnufacturerIds(username);
     this.manufacturerIds = manufacturersId.result
     const observableResult: Observable<any> = await this.apiService.getMachines(username);
 
     observableResult.subscribe((res) => {
      this.machines = res   

        this.machines.forEach(machine => {
          machine.purchasedatetime = this.utilsService.convertDatetimeFormat(machine.purchasedatetime);
         machine.capacity = this.utilsService.convertCapacity(machine.capacity)
        });

        this.userFullname$.subscribe((fullName)=>{
         this.currentName = fullName ?? 'noname'
         }) 
    });

    setTimeout(async () => {
      try {
        const images: Observable<any> = await this.apiService.getImages(username);

        images.subscribe((res)=>{
           this.images = res
           let machinesTemp = this.utilsService.updateImages(this.machines,this.images)
           this.machines = machinesTemp
          
        })
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }, 150);  

 

  }

   closeModal() {
      this.isEditVisible = false
    }




    
    async onGridFilterChange($event: any) {
      console.log(this.myGrid);
    
      if ($event.filters[0].field == 'machinename' && $event.filters[0].operator == 'contains') {
        let fieldName = $event.filters[0].field;
        let searchParams = $event.filters[0].value;
    
        this.apiService.searchNames(fieldName, searchParams, this.currentName).then((response: any) => {
          if (response.status != 500) {
            this.machines = response;
            this.synchronizeData();
          } else {
            this.machines = [];
          }
        });
      } else if ($event.filters[0].field == 'manufacturerid' && $event.filters[0].operator == 'eq') {
              let searchParams = parseInt($event.filters[0].value);
              this.apiService.searchManufacturer(searchParams, this.currentName ).then((response: any) => {
                if (response.status != 500) {
                  this.machines = response;
                  this.synchronizeData();
                } else {
                  this.machines = [];
                }
              });
      }else if($event.filters[0].field == 'machinestatus' && $event.filters[0].operator == 'eq'){
        let searchParams = parseInt($event.filters[0].value);
        this.apiService.searchStatus(searchParams, this.currentName ).then((response: any) => {
          if (response.status != 500) {
            this.machines = response;
            this.synchronizeData();
          } else {
            this.machines = [];
          }
        });
      }
    }
    
    
    
    onGridSortChange($event: any ){
      this.apiService.order($event,this.currentName ).then((response: any) => {
        
        if (response.status != 500) {
          this.machines = response;
          this.synchronizeData();
        } else {
          this.machines = [];
        }
      });
     
    }

    actionsManagment(data :any, machine? :Machine | any ) {
      console.log('managment')
      this.currentMachine = machine
      if(data === 'startDelete'){
              this.isDeleteModalOpen = true
              this.toBeDeletedId = machine.machineid
      }
      else if(data === 'cancelDelete'){
        this.isDeleteModalOpen = false
      }
      else if(data === 'delete') {
        this.isDeleteModalOpen = false
        this.apiService.deleteMachine(this.toBeDeletedId, this.currentName)
        .then(
          (response : any) => {
             if(response.status==200){
                this.machines = this.machines.filter(m => m.machineid !== response.id);
             }
          }
        )
        .catch(
          error => {
            console.error('Error deleting machine', error);
            // Handle error
          }
        );
      }
     else if(data === 'startEdit'){
        this.isEditVisible = true;
      }
      
      else if (data === 'submitEdit'){
         
       let editedValues =  this.utilsService.prepareEditData(machine)
        
    
        this.apiService.updateMachine(this.currentName,editedValues  )
        .then(
          (response : any) => {
             if(response.machineResponse.status==200){
               
              let updatedMachine = response.machineResponse.res.result[0]
              updatedMachine.purchasedatetime = this.utilsService.convertDatetimeFormat(updatedMachine.purchasedatetime)
              updatedMachine.capacity = this.utilsService.convertCapacity(updatedMachine.capacity)
              let machineIndex = this.machines.findIndex(machine => machine.machineid === updatedMachine.machineid);    
              if (machineIndex !== -1) {           
                const updatedMachines = [...this.machines];
                updatedMachines[machineIndex] = { ...updatedMachines[machineIndex], ...updatedMachine };
                this.machines = updatedMachines;
                }
             }
             if(response.imageResponse?.status==200){
                let updatedImage = response.imageResponse.result.result
                const machineIdToFind = updatedImage[2];
                const foundMachine = this.machines.find(machine => machine.machineid === machineIdToFind);
                if(foundMachine){
                     foundMachine.imageurl = updatedImage[1];

                }

                 
             }
          }
          
        )
        .catch(
          error => {
            console.error('Error deleting machine', error);
            // Handle error
          }
        ); 
      }

     
          
    }







    synchronizeData(){
      this.machines.forEach(machine => {
        machine.purchasedatetime = this.utilsService.convertDatetimeFormat(machine.purchasedatetime);
       machine.capacity = this.utilsService.convertCapacity(machine.capacity)
      });

      setTimeout(async () => {
        try {
          const images: Observable<any> = await this.apiService.getImages(this.currentName);
  
          images.subscribe((res)=>{
             this.images = res
             let machinesTemp = this.utilsService.updateImages(this.machines,this.images)
             this.machines = machinesTemp
            
          })
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      }, 150);  
    }

}
