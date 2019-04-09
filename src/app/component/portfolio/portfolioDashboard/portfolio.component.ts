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
    //get the currently logged in user
    this.userService.currentUser().subscribe(
      res => {
        this.user = res;
        this.username = res.username;
        //once the current user is determined, build the user's portfolios
        this.buildPortfolios();
    });

  }

  //This function builds the arrays of the user's portfolios and watchlists
  private buildPortfolios(){
    //retrieve all portfolios from the database
    this.portfolioService.getAllPortfolio(this.username).subscribe(
      res => {
        //for every portfolio, seperate into portfolio/watchlist depending on type
        res.forEach(portfolio => {
          if (portfolio.portfolioType == true){
            this.portfolios.push(portfolio);
          }else{
            this.watchlists.push(portfolio);
          }
        });
        //hide the loading spinner
        this.spinnerService.hide();
      }
    );
  }

  //sets submitted to true and call the save function
  private addPortfolio(){
    this.submitted = true;
    this.save();
  }

  //Saves a portfolio into the database
  private save(){
    this.newportfolio.username = this.username;
    //Calls api to create a new portfolio
    this.portfolioService.addPortfolio(this.newportfolio).subscribe(
      ()=> {
        //Resets the portfolio and watchlist arrays to null and rebuilds
        //needs to be null or it will just add all portfolios back onto the old lists and show them twice
        this.portfolios = new Array();
        this.watchlists = new Array();
        this.buildPortfolios();
      });
  }

  //delete a portfolio
  private deletePortfolio(portfolioID: Number){
    this.portfolioService.deletePortfolio(portfolioID).subscribe(
      ()=> {
        //Resets the portfolio and watchlist arrays to null and rebuilds
        //needs to be null or it will just add all portfolios back onto the old lists and show them twice
        this.portfolios = new Array();
        this.watchlists = new Array();
        this.buildPortfolios();
      }
    );
  }
}
