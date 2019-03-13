import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../../service/navbar.service';
import { SidebarService } from '../../../service/sidebar.service'
import { UserService } from '../../../service/user.service'
import { AuthenticationService } from '../../../service/authentication.service'
import { PortfolioService } from '../../../service/portfolio.service'
import { Portfolio2 } from '../../../model/portfolio2'
import { Location } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { User } from '../../../model/user'

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
 
  private username: string;
  private portfolios: Portfolio2[] = new Array();
  private watchlists: Portfolio2[] = new Array();
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

  private addPortfolio(){
    this.submitted = true;
    this.save();
  }

  private save(){
    this.newportfolio.username = this.username;
    this.portfolioService.addPortfolio(this.newportfolio).subscribe(
        ()  =>  window.location.reload()
    ); 
  }
}
