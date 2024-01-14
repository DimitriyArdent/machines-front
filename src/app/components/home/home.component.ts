import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router   } from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  username: string | undefined;
    constructor(private route: ActivatedRoute, private router:Router) { }
    ngOnInit(): void {
     let   fragment   = this.route.snapshot.fragment
     this.username = fragment !== null ? fragment : undefined;
   
    }
    onClick(){
      this.router.navigate(['/managment'], { queryParams: { username: this.username }})
    }
}
