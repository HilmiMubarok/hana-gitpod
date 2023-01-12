import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomMatMenu } from './menu.model';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { TemplateService } from '../template/template.service';
import { SessionStorageService } from 'ngx-webstorage';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { IEmployee } from '../../entities/employee/employee.model';
import { EmployeeService } from '../../entities/employee/employee.service';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public menuListItems: CustomMatMenu[] = [];
  public isLogin: Boolean = false;
  public account: Account | null = null;

  public loginName: string;
  public lastLogin: string;
  private durationInSecond: Number = 2;
  protected horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  protected verticalPosition: MatSnackBarVerticalPosition = 'top';
  public isAdministrator: boolean = false;
  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private templateService: TemplateService,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private translateService: TranslateService,
    private employeeService: EmployeeService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.defineAccountMenu();
    this.checkLogin();
  }

  private checkLogin(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.isLogin = true;

        this.employeeService
          .queryFilterBy({
            page: 0,
            query: 999,
            login: account.login,
            sort: ['id,desc'],
          })
          .subscribe({
            next: (res: HttpResponse<IEmployee[]>) => this.setUpAcc(res, account),
            error: (res: HttpErrorResponse) => this.onError(res.message),
          });
      }
    });
  }

  private setUpAcc(res: any, account: any): void {
    this.loginName = res.body[0].person.firstName + ' ' + res.body[0].person.lastName;
    this.lastLogin = account.lastModifiedDate.substring(0, 19);
    if (this.account.login === 'admin') {
      this.isAdministrator = true;
    }
  }

  private onError(errorMessage: string) {
    this._snackBar.open(errorMessage, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSecond.valueOf() * 1000,
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
