import { Component } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  user = new User();
  submitted = false;

  constructor( private UserService: UserService) {}

  questions = ['What was your first pets name?', 'What is your mothers maiden name?',
            'What street do you live on?', 'What is your favourite colour?'];
           
  addUser() {
    console.log("adding user");
    this.submitted = true;
    this.save();
  }

  private save(): void {
    console.log("adding user");
    this.UserService.addUser(this.user)
        .subscribe();
  }


}
