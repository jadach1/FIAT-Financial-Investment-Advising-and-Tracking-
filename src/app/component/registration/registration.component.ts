import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { User } from '../../model/user';
import { UserService } from '../../service/user.service';
import { AuthenticationService } from '../../service/authentication.service'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  user = new User();
  submitted = false;

  questions = ['What was your first pets name?', 'What is your mothers maiden name?',
  'What street do you live on?', 'What is your favourite colour?'];

  constructor( private UserService: UserService,
    private authService: AuthenticationService,
    private router: Router) {}
           
  addUser() {
    console.log(
      this.user.username + ",",
      this.user.password + ",",
      this.user.firstname + ",",
      this.user.lastname + ",",
      this.user.email + ",",
      this.user.recoveryQuestion + ",",
      this.user.recoveryAnswer
    );
    this.submitted = true;
    this.save();
  }

  private save(): void {
    console.log("adding user");
    this.UserService.addUser(this.user)
        .subscribe(res=>
          this.login()
        );
  }

  public login(): void{
    this.authService.login(this.user)
      .subscribe(
        res => "",
        err => alert("error on login"),
        () => this.router.navigateByUrl('/dashboard')
      );
  }


}
