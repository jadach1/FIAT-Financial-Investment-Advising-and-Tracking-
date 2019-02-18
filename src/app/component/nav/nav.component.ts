import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../service/navbar.service';
import { AuthenticationService } from '../../service/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [AuthenticationService]
})
export class NavComponent implements OnInit {

  constructor(private router: Router, public nav: NavbarService, private authService: AuthenticationService) { }

  ngOnInit() {
  }

  public logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
