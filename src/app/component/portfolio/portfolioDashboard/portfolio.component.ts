import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../../service/navbar.service';
import { SidebarService } from '../../../service/sidebar.service'
import { UserService } from '../../../service/user.service'
import { AuthenticationService } from '../../../service/authentication.service'
import { PortfolioService } from '../../../service/portfolio.service'
import { Portfolio2 } from '../../../model/portfolio2'
import { Location } from '@angular/common';

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

  constructor(
    public nav: NavbarService, 
    public sidebar: SidebarService, 
    private authService: AuthenticationService, 
    private userService: UserService,
    private portfolioService : PortfolioService,
    private location: Location) { 
      this.nav.show();
      this.sidebar.show();
  }

  ngOnInit() { 
   
    this.userService.currentUser().subscribe(
      res => {
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
      }
    );
  }

  private addPortfolio(){
    this.submitted = true;
    this.save();
  }

  private save(){
    this.newportfolio.username = this.username;
    this.portfolioService.addPortfolio(this.newportfolio).subscribe();
    window.location.reload();
  }
}
