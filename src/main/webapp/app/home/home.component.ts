import { Component, OnInit } from '@angular/core';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { StrapiService } from 'app/shared/integration/strapi.service';
import { IHomePage } from 'app/shared/integration/models/home-page.model';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  account: Account | null = null;
  public contentPage: IHomePage;

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private strapiService: StrapiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const isOnHomePage = this.router.url === '/' || this.router.url === '';

    if (isOnHomePage) {
      this.accountService.identity(true).subscribe(account => {
        this.account = account;
        if (account) {
          this.goToDashboard();
        } else {
          this.login();
        }
      });
    } else {
      this.accountService.identity().subscribe(account => {
        this.account = account;
      });
    }

    this.getHomePage();
  }

  login(): void {
    this.loginService.login();
  }

  private goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  getHomePage(): void {
    this.strapiService.getHomePage().subscribe((res: HttpResponse<IHomePage>) => {
      this.contentPage = res.body;
    });
  }
}
