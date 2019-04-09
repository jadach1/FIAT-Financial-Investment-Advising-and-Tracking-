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
  public tempPassword;
  public oldPassword;
  public repsonseToUser;
  
  constructor(private router: Router, private authService: AuthenticationService,
    private userService: UserService) {
    this.user = new User();
    this.userService.currentUser().subscribe(
      res => this.user = res
    );
  }

  updateUser() {
    this.submitted = true;
    this.save();
    this.router.navigateByUrl('/');
  }

  /*
    This will match the old password to the new one to verify that they match
  */
  verifyPassword() {
    if ( this.oldPassword == this.user.password )
    {
      console.log("old password matches new password")
      this.user.password = this.tempPassword
      alert("Password was validated successfully !")
      this.updateUser()
      this.resetForm()
    } else {
      alert("Sorry, the password you entered is not valid.")
      this.resetForm()
    }
  }

  private resetForm() {
    this.tempPassword = ""
    this.oldPassword = ""
    this.submitted = false;
  }

  private save(): void {
    console.log('saving user');
    this.userService.updateUser(this.user)
        .subscribe();
  }

  ngOnInit() {
  }

}
