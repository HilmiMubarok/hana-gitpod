import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ILoadedEventArgs, ChartTheme } from '@syncfusion/ej2-angular-charts';
import { Browser } from '@syncfusion/ej2-base';
import { AccountService } from 'app/core/auth/account.service';
import { TemplateService } from 'app/layouts/template/template.service';
import { LoginService } from 'app/login/login.service';
import { SessionStorageService } from 'ngx-webstorage';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeService } from 'app/entities/employee/employee.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CustomMatMenu } from 'app/layouts/navbar/menu.model';
import { Account } from 'app/core/auth/account.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IEmployee } from 'app/entities/employee/employee.model';

@Component({
  selector: 'jhi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  public primaryXAxis: Object;
  public chartData: Object[];

  public data: Object[] = [
    { x: new Date(2005, 0, 1), y: 21 },
    { x: new Date(2006, 0, 1), y: 24 },
    { x: new Date(2007, 0, 1), y: 36 },
    { x: new Date(2008, 0, 1), y: 38 },
    { x: new Date(2009, 0, 1), y: 54 },
    { x: new Date(2010, 0, 1), y: 57 },
    { x: new Date(2011, 0, 1), y: 70 },
  ];

  public data1: Object[] = [
    { x: new Date(2005, 0, 1), y: 28 },
    { x: new Date(2006, 0, 1), y: 44 },
    { x: new Date(2007, 0, 1), y: 48 },
    { x: new Date(2008, 0, 1), y: 50 },
    { x: new Date(2009, 0, 1), y: 66 },
    { x: new Date(2010, 0, 1), y: 78 },
    { x: new Date(2011, 0, 1), y: 84 },
  ];

  // Initializing Primary X Axis
  public primaryXAxis2: Object = {
    valueType: 'DateTime',
    labelFormat: 'y',
    intervalType: 'Years',
    edgeLabelPlacement: 'Shift',
    majorGridLines: { width: 0 },
  };

  // Initializing Primary Y Axis
  public primaryYAxis2: Object = {
    labelFormat: '{value}%',
    rangePadding: 'None',
    minimum: 0,
    maximum: 100,
    interval: 20,
    lineStyle: { width: 0 },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 },
  };
  public chartArea: Object = {
    border: {
      width: 0,
    },
  };

  public width: string = Browser.isDevice ? '100%' : '60%';
  public marker: Object = {
    visible: true,
    height: 10,
    width: 10,
  };
  public tooltip: Object = {
    enable: true,
  };
  // custom code start
  public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, 'Dark');
  }
  // custom code end
  public title: String = 'Inflation - Consumer Price';
  public menuListItems: CustomMatMenu[] = [];
  public positionListItems: CustomMatMenu[] = [];
  public isLogin: Boolean = false;
  public account: Account | null = null;

  public loginName: string;
  public lastLogin: string;
  public positionIdPub: string;
  public internalIdPub: string;
  public positionName: string;
  public internalName: string;
  public isPositionMoreThan1 = false;
  private cNamePos = 'POS';
  private cNameInt = 'INT';
  private durationInSecond: Number = 2;
  protected horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  protected verticalPosition: MatSnackBarVerticalPosition = 'top';
  public isAdministrator = false;
  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private templateService: TemplateService,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private translateService: TranslateService,
    private employeeService: EmployeeService,
    private _snackBar: MatSnackBar
  ) {
    // code
  }

  ngOnInit(): void {
    this.checkLogin();
  }

  private onError(errorMessage: string) {
    this._snackBar.open(errorMessage, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSecond.valueOf() * 1000,
    });
  }

  private checkLogin(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.isLogin = true;

        this.employeeService
          .queryFilterBy({
            page: 0,
            query: 999,
            eqLogin: account.login,
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
    this.positionIdPub = '';
    this.internalIdPub = '';

    if (res.body.length < 1) {
      this.loginName = 'First Name Last Name';
    } else {
      this.loginName = res.body[0].person.firstName + ' ' + res.body[0].person.lastName;
    }

    if (account.login === 'admin') {
      this.isAdministrator = true;
    }
  }
}
