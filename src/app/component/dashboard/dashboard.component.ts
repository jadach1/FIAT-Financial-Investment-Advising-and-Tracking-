import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';

import { NavbarService } from '../../service/navbar.service';
import { SidebarService } from '../../service/sidebar.service';
import { AuthenticationService } from '../../service/authentication.service';
import { UserService } from '../../service/user.service'

import { User } from 'src/app/model/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('dashboardChart') myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;

  public user: User;
  chart = [];

  constructor( public nav: NavbarService, public sidebar: SidebarService, private authService: AuthenticationService, private userService: UserService) { 
    this.nav.show(); 
    this.sidebar.show();

    this.user = new User();

    this.userService.currentUser().subscribe(
      res =>this.user = res
    );
  }
 
  ngOnInit() {
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
    
    this.chart = new Chart(this.context, {
      type: 'line',
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
          label: "My First dataset",
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [0, 10, 5, 2, 20, 30, 45],
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }
}

