import { Component, OnInit } from '@angular/core';
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

  user           = new User();
  submitted      = false;
  // The below variables are used to make sure the email and username are not duplicated
  validUserName:    any; 
  validEmail:       any; 
  registrationString: string;
  registrationStatus: string;
  confirmPassword:    string;

  questions = ['What was your first pets name?', 
               'What is your mothers maiden name?',
               'What street do you live on?', 
               'What is your favourite colour?'];

  constructor( private UserService: UserService,
    private authService: AuthenticationService,
    private router: Router) {}
      
    ngOnInit(){
      
    }
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
    
    if (this.user.password === this.confirmPassword )
    {
      // check if username already exists
      this.checkIfUserNameExists()
    } else {
      this.registrationString = "Your passwords do not match.  Please try again."
      this.registrationStatus = "Unsuccessful"
      this.submitted = true
    }

  }

  /*
     This function will pass 2 values to the userService
     a fieldname and a value
     the service will fetch the number of rows where username=value
     it will return a number 
  */
  private checkIfUserNameExists() {
    this.UserService.checkIfValueExists("username",this.user.username)
      .subscribe(
        res=> this.validUserName = res,
        err=> {console.log("Error occured when checking database"),
               this.registrationString = "Sorry, we are experiencing " + 
                                          "technical difficulties!  Please try again later."
               this.submitted = true
              },
        () =>  this.checkIfEmailExists()
      );
  }

    /*
     This function will pass 2 values to the userService
     a fieldname and a value
     the service will fetch the number of rows where email=value
     it will return a number 
  */
  private checkIfEmailExists() {
    this.UserService.checkIfValueExists("email",this.user.email)
      .subscribe(
        res=> this.validEmail = res,
        err=> {console.log("Error occured when checking database 2"),
               this.registrationString = "Sorry, we are experiencing " + 
                                          "technical difficulties!  Please try again later.",
               this.submitted = true
              },
        async () => this.submitted = await this.verifyIfValueExists() 
      );
  }

  /*
  Check to see if both the email and username do not already exists,
  and provide the user with proper feedback
  */
  private verifyIfValueExists(): boolean {
  
      if ( this.validUserName != 0 )
      {
        this.registrationString = "Sorry, but this username is already being used"
        this.registrationStatus = "Unsuccessful"
      } else if ( this.validEmail != 0 )
      {
        this.registrationString = "Sorry, but this email address is already being used"
        this.registrationStatus = "Unsuccessful"
      } else {
         this.save()
      }
      return true;
}

  /*
    This will take the user object and try to create it inside the database
  */
  private async save() {
    console.log("adding user");
    this.UserService.addUser(this.user)
        .subscribe(res=>{
                        this.registrationStatus = "Successful"
                        this.registrationString = "Please click the verification link sent to your email to login."
                        this.clearForm()
                      }),
                   err=>{
                        console.log("Error occured when checking database"),
                        this.registrationString = "Sorry, we are experiencing " + 
                                                  "technical difficulties!  Please try again later."
                      }
  }


  // reset the submitted variable to false
  // this will enable the user to reopen the form
  private openForm() {
    this.submitted = false
    this.user.password = ''
    this.confirmPassword = ''
  }

  // This will reset the form fields after successful registration
  private clearForm() {
    this.user.username = ''
    this.user.password = ''
    this.user.firstname = ''
    this.user.lastname = ''
    this.user.email = ''
    this.user.recoveryQuestion = ''
    this.user.recoveryAnswer = ''
  }
}
