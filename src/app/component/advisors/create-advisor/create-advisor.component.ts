import { Component, OnInit } from '@angular/core';
import { NavbarService     } from '../../../service/navbar.service';
import { AdvisorService    } from '../../../service/advisor.service'


@Component({
  selector: 'app-create-advisor',
  templateUrl: './create-advisor.component.html',
  styleUrls: ['./create-advisor.component.css']
})
export class CreateAdvisorComponent implements OnInit {

  public test: string = 'hellow world';
  
  constructor(public nav: NavbarService, public advisor: AdvisorService) { }

  

  ngOnInit() {
    this.nav.show();
  }

}
