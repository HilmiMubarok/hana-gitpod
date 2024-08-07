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
import { Authority } from 'app/config/authority.constants';
import lodash from 'lodash';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
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
  private cNamePosO = 'POSO';
  private cNamePosOD = 'POSOD';
  private cNamePosOPARID = 'POSOPARID';
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

  public setCookie(cname: string, cvalue: any, cdesc: any): void {
    this.positionIdPub = cvalue;
    if (cname === 'POS') {
      this.positionName = cdesc;
    } else if (cname === 'INT') {
      this.internalName = cdesc;
    }
    document.cookie = cname + '=' + cvalue + ';';
  }

  public deleteCookie(cname: string, cvalue: any): void {
    const d = new Date();
    d.setTime(d.getTime() + -1 * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';';
  }

  private setUpAcc(res: any, account: any): void {
    this.positionIdPub = '';
    this.internalIdPub = '';

    if (res.body.length < 1) {
      this.loginName = 'First Name Last Name';
      this.lastLogin = 'Not Registered Employee';

      this.positionName = 'Not Registered Position';
      this.setCookie(this.cNamePos, '', this.positionName);
      this.setCookie(this.cNamePosO, '', this.positionName);
      this.setCookie(this.cNamePosOD, '', this.positionName);
      this.setCookie(this.cNamePosOPARID, '', this.positionName);

      this.internalName = 'Not Registered Internal';
      this.setCookie(this.cNameInt, '', this.internalName);

      this.templateService.changePosInt('ADMIN_MAYBE');
    } else {
      if (res.body[0].person.lastName === null) {
        this.loginName = res.body[0].person.firstName;
      } else {
        this.loginName = res.body[0].person.firstName + ' ' + res.body[0].person.lastName;
      }
      this.lastLogin = account.lastModifiedDate.substring(0, 19);

      if (res.body[0].positions.length > 0) {
        let i = 0;
        let isFirstPosActive = false;
        let indexHelper: number;
        let positionId = '';
        let positionTypeDescription = '';
        let internalId = '';
        let internalName = '';
        let positionTypeId = '';
        let positionActive = 0;
        let positionPartyId = '';

        while (!isFirstPosActive && i < res.body[0].positions.length) {
          if (res.body[0].positions[i].statusCode === 'ACTIVE' || res.body[0].positions[i].statusId === 'ACTIVE') {
            this.positionIdPub = res.body[0].positions[i].id;
            positionId = res.body[0].positions[i].id;
            positionTypeId = res.body[0].positions[i].positionTypeId;
            positionTypeDescription = res.body[0].positions[i].positionTypeDescription;
            positionPartyId = res.body[0].partyId;

            this.internalIdPub = res.body[0].positions[i].internalId;
            internalId = res.body[0].positions[i].internalId;
            internalName = res.body[0].positions[i].internalName;

            isFirstPosActive = true;
            indexHelper = i;
            i = res.body[0].positions.length - 1;
          }
          i++;
        }

        this.positionName = positionTypeDescription === '' ? 'Not Have Active Position' : positionTypeDescription;
        this.internalName = internalName === '' ? 'Not Have Active Position' : internalName;

        if (positionId !== '' && positionTypeDescription !== '') {
          this.setCookie(this.cNamePos, positionId, positionTypeDescription);
          this.setCookie(this.cNamePosO, positionTypeId, positionTypeDescription);
          this.setCookie(this.cNamePosOD, positionTypeDescription, positionTypeDescription);
          this.setCookie(this.cNamePosOPARID, positionPartyId, positionTypeDescription);
        }

        if (internalId !== '' && internalName !== '') {
          this.setCookie(this.cNameInt, internalId, internalName);
        }

        if (isFirstPosActive) {
          res.body[0].positions.forEach(position => {
            if (position.statusCode === 'ACTIVE' || position.statusId === 'ACTIVE') {
              positionActive++;
            }
          });
        }

        if (positionActive > 1) {
          this.isPositionMoreThan1 = true;
          res.body[0].positions.forEach(position => {
            if (position.statusCode === 'ACTIVE' || position.statusId === 'ACTIVE') {
              this.definePositionMenu(position);
            }
          });
        }

        if (positionTypeId !== '') {
          this.templateService.changePosInt(positionTypeId);
        }

        if (indexHelper === 0 || indexHelper > 0) {
          this.templateService.changePosIntObject(res.body[0].positions[indexHelper]);
        }
      }
    }

    if (account.login === 'admin') {
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

  private definePositionMenu(positions: any): void {
    const arrayPositions = [];
    arrayPositions.push(positions);
    arrayPositions.forEach(position => {
      if (position.statusCode === 'ACTIVE' && position.statusId === 'ACTIVE') {
        const item: CustomMatMenu = new CustomMatMenu();
        item.text = position.positionTypeDescription + ' - ' + position.internalName;
        item.fn = () => {
          const posN = lodash.clone(this.positionName);
          this.setCookie(this.cNamePos, position.id, position.positionTypeDescription);
          this.setCookie(this.cNamePosO, position.positionTypeId, position.positionTypeDescription);
          this.setCookie(this.cNamePosOD, position.positionTypeDescription, position.positionTypeDescription);
          this.setCookie(this.cNamePosOPARID, position.partyId, position.positionTypeDescription);
          this.setCookie(this.cNameInt, position.internalId, position.internalName);
          this.templateService.changePosInt(position.positionTypeId);
          this.templateService.changePosIntObject(position);
        };
        this.positionListItems.push(item);
      }
    });
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
    this.deleteCookie(this.cNamePos, this.positionIdPub);
    this.deleteCookie(this.cNameInt, this.internalIdPub);
    this.loginService.logout();
    // this.router.navigate(['']);
  }
}
