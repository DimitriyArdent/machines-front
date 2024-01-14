import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router   } from '@angular/router';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private loginService: LoginService, private router:Router, private apiService:ApiService) { }

  username: string = '';
  password: string = '';

  async onSubmit(loginData: any): Promise <void> {
    try {
    //  const res = await this.loginService.loginUser(loginData).toPromise()
    const res = await this.loginService.loginUser(loginData).toPromise()
      if(res){
       let name = res.full_name
        this.router.navigate(['/home' ],  {fragment:name} )
      }
    } catch (error) {
        console.log(error)
    }
  }

 
}
