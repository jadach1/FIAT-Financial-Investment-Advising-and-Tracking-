import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Router } from '@angular/router'

import { User} from '../../model/user'
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new User();
  username2 = new FormControl('');
  password2 = new FormControl('');

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  public login(){
    this.user.username = this.username2.value;
    this.user.password = this.password2.value;

    console.log(this.user.username + "," + this.user.password);
    alert("we are inside log in")
    this.authService.login(this.user)
    .subscribe(
      res => alert("successful response on login"),
      err => alert("error on login"),
      () => {alert("completed login"), this.router.navigateByUrl('/dashboard')}
      );
  }

}
