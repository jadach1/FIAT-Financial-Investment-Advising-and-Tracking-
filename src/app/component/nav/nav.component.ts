import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../service/user.service'
import { User } from 'src/app/model/user';
import { NavbarService } from '../../service/navbar.service';
import { AuthenticationService } from '../../service/authentication.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [AuthenticationService]
})
export class NavComponent implements OnInit {

  public user: User;

  constructor(private router: Router, public nav: NavbarService, private authService: AuthenticationService, private userService: UserService) { 
    this.user = new User();
    this.userService.currentUser().subscribe(
      res => this.user = res
    );
  }

  ngOnInit() {
  }

  public logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
