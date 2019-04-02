import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../../service/navbar.service';

import { SidebarService } from '../../../service/sidebar.service';
import { UserService } from '../../../service/user.service';
import { AdvisorService } from '../../../service/advisor.service';
import { AuthenticationService } from '../../../service/authentication.service';
import { PortfolioService } from '../../../service/portfolio.service';
import { Portfolio2 } from '../../../model/portfolio2';
import { advisor } from '../../../model/advisor';
import { Location } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { User } from '../../../model/user';
import { Router } from '@angular/router'

@Component({
  selector: 'app-advisors',
  templateUrl: './advisors.component.html',
  styleUrls: ['./advisors.component.css']
})
export class AdvisorsComponent implements OnInit {

  private username: string;
  private portfolios: Portfolio2[] = new Array();
  private watchlists: Portfolio2[] = new Array();
  private advisors: advisor[] = new Array();
  private newadvisor = new advisor();
  private newportfolio = new Portfolio2();
  private submitted = false;
  private user: User;

  constructor(
    public nav: NavbarService,
    public sidebar: SidebarService, 
    private authService: AuthenticationService, 
    private userService: UserService,
    private portfolioService : PortfolioService,
    private location: Location,
    private router: Router,
    private advisorService : AdvisorService,
    private spinnerService: Ng4LoadingSpinnerService) { 
      this.nav.show();
      this.sidebar.show();
      this.spinnerService.show();
  }

  ngOnInit() {

    this.userService.currentUser().subscribe(
      res => {
        this.user = res;
        this.username = res.username;
        this.buildPortfolios();
        this.buildAdvisors();
    });

  }

  private buildPortfolios(){
    this.portfolioService.getAllPortfolio(this.username).subscribe(
      res => {
        res.forEach(portfolio => {
          if (portfolio.portfolioType == true){
            this.portfolios.push(portfolio);
          }else{
            this.watchlists.push(portfolio);
          }
        });
        this.spinnerService.hide();
      }
    );
  }

  private buildAdvisors(){
    this.advisorService.getAllAdvisor(this.username).subscribe(
      res => {
        console.log(res);
        res.forEach(advisor => {
            this.advisors.push(advisor);
          });
        });
        this.spinnerService.hide();
      }
  

  private addAdvisor(){
    this.submitted = true;
    this.save();
  }

  private save(){
    this.newadvisor.username = this.username;
    this.advisorService.addAdvisor(this.newadvisor).subscribe(
      ()=> window.location.reload()
    );

  }

}
