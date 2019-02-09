import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../service/navbar.service';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../../service/authentication.service';
import { UserService } from '../../service/user.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public user: Observable<any>;

  constructor( public nav: NavbarService, private authService: AuthenticationService, private userService: UserService) { }

  ngOnInit() {
    this.nav.show();
    this.user = this.userService.getUser("admin");
  }
}
