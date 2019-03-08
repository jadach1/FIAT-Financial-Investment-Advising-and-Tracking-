import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../service/navbar.service';
import { AdvisorService } from '../../service/advisor.service'
import { UserService } from '../../service/user.service'

@Component({
  selector: 'app-advisors',
  templateUrl: './advisors.component.html',
  styleUrls: ['./advisors.component.css']
})
export class AdvisorsComponent implements OnInit {

  public test: string = 'hellow world'
  public array: string[]

  constructor(public nav: NavbarService, public advisor: AdvisorService, public user: UserService) { }

  ngOnInit() {
    this.nav.show()
    this.apiTest();
  }

  public apiTest() {
  
    this.advisor.test()
    // .subscribe(
    //     res => {this.array = res, alert("success")},
    //     err => alert("error " + err),
    //     () => alert("complete ")
    //   )

    this.user.getUser("admin")
    // .subscribe(
    //     res => {this.array = res, alert("success")},
    //     err => alert("error " + err),
    //     () => alert("complete ")
    //   )
  }
}
