import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ManagmentComponent } from './components/managment/managment.component';
import { AuthGuard } from './guards/auth.guard';

 export const routes: Routes = [
    { path: '', redirectTo:'login', pathMatch: 'full'    },
    { path: 'login', component: LoginComponent },
     { path: 'home', component: HomeComponent },
     { path: 'managment', component: ManagmentComponent, canActivate:[AuthGuard]},

     
];
