import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../model/user';
import { UserService } from '../../service/user.service';
import { FormControl } from '@angular/forms';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public user: User;
  submitted = false;

  constructor(private router: Router, private authService: AuthenticationService,
    private userService: UserService) {
    this.user = new User();
    this.userService.currentUser().subscribe(
      res => this.user = res
    );
  }

  updateUser() {
    console.log(
      this.user.firstname + ',',
      this.user.lastname + ',',
      this.user.email + ',',
      this.user.password + ','
    );
    this.submitted = true;
    this.save();
    this.router.navigateByUrl('/');
  }

  private save(): void {
    console.log('saving user');
    this.userService.updateUser(this.user)
        .subscribe();
  }

  ngOnInit() {
  }

}
