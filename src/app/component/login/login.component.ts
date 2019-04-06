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

    new Promise(res=>{
      //set username and password to the values set in the modal
      this.user.username = this.username2.value;
      this.user.password = this.password2.value;
      return res();
    }).then(res=>{
      //call the login function, if successful user is redirected to the dashboard
      this.authService.login(this.user)
      .subscribe(
        res => "",
        err => alert("error on login"),
        () => this.router.navigateByUrl('/dashboard')
        );
    })
  }

}
