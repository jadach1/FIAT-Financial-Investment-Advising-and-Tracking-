import { Component } from '@angular/core';
import { User } from '../../model/user';
import { UserService } from '../../service/user.service';

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

  constructor( private UserService: UserService) {}
           
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
        .subscribe();
  }


}
