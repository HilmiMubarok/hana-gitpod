import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomMatMenu } from './menu.model';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { TemplateService } from '../template/template.service';
import { SessionStorageService } from 'ngx-webstorage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public menuListItems: CustomMatMenu[] = [];
  public isLogin: Boolean = false;
  public account: Account | null = null;
  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private templateService: TemplateService,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.defineAccountMenu();
    this.checkLogin();
  }

  private checkLogin(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.isLogin = true;
      }
    });
  }

  public changeLanguage(languageKey: string): void {
    this.sessionStorageService.store('locale', languageKey);
    this.translateService.use(languageKey);
    location.reload();
  }

  public toggleSidebar(): void {
    this.templateService.toggle();
  }

  private defineAccountMenu(): void {
    const item: CustomMatMenu = new CustomMatMenu();
    this.accountService.identity().subscribe(acc => {
      if (acc) {
        item.text = 'Sign Out';
        item.fn = () => this.logout();
      } else {
        item.text = 'Sign In';
        item.fn = () => this.login();
      }
      this.menuListItems.push(item);
    });
  }

  public login(): void {
    this.loginService.login();
  }

  public logout(): void {
    this.loginService.logout();
    this.router.navigate(['']);
  }
}
