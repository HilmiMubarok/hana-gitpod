import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SUBMENU_PARTY_CIF } from 'app/shared/constants/base.constants';
import lodash, { update } from 'lodash';
import { MessageService } from 'primeng/api';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { PartySlikService } from '../party-slik/party-slik.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

import { IPartyCif } from '../party-cif/party-cif.model';
import { DebtorDataSlikTransferService } from '../debtor-data/slick-summary/debitur/debtor-data-silk-upload/debtor-data-slik-transfer.service';
import { ICollateral } from '../collateral/collateral.model';
import { CollateralService } from '../collateral/collateral.service';
import { LoginService } from 'app/login/login.service';
import { PositionService } from '../position/position.service';

import { BankAccountDialogComponent } from './bank-account-dialog.component';
import { BankAccountModel, IBankAcountModel } from './bank-account.model';
import { BankAccountService } from './bank-account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';

@Component({
  selector: 'jhi-bank-account-detail',
  templateUrl: './bank-account-detail.component.html',
  styleUrls: ['./bank-account.style.scss', './bank-account-detail.style.css'],
})
export class BankAccountDetailComponent extends AbstractEntityMaterialComponent<IBankAcountModel> implements OnInit {
  public displayedColumns: string[] = ['no', 'name', 'bank', 'no-account', 'currency', 'description', 'status', 'action'];

  private id: string;
  public collateralAppraisal: ICollateralAppraisal;
  public clickedMenu: string;
  public partyCif: IPartyCif | null = null;
  public partyCifStartState: IPartyCif | null = null;
  public collateralInfo: ICollateral[];
  public subMenu: object[];
  public arrSliks: Object[];
  private internalIdLocStor: string;
  private positionIdLocStor: string;
  public positionTypeId: string;
  appName: any;
  appNameMenu: any;
  public parentPath = this.router.url.split('/')[1];
  public value: string;
  public isOpen = false;
  public dataSourceBankAccount: IBankAcountModel[] = [];

  constructor(
    private dialog: MatDialog,
    protected messageService: MessageService,
    protected collateralService: CollateralService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    protected bankAccountService: BankAccountService,
    protected loginService: LoginService,
    private partySlikService: PartySlikService,
    private TransferService: DebtorDataSlikTransferService,
    private positionService: PositionService,
    protected _snackbar: MatSnackBar
  ) {
    super(_snackbar, bankAccountService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.partyCif = this.activatedRoute.snapshot.data['content'];
    this.partyCifStartState = this.activatedRoute.snapshot.data['content'];
    this.clickedMenu = 'customer-info';
    this.collateralInfo = [];
    this.subMenu = SUBMENU_PARTY_CIF;
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.clickedMenu = subRoute;
      }
    });
  }

  ngOnInit(): void {
    this.getPositionTypeId();
    // this.getTitleMenu();
    this.internalIdLocStor = this.getLocStor('INT');
    this.positionIdLocStor = this.getLocStor('POS');
    if (!this.internalIdLocStor || !this.positionIdLocStor) {
      this.logout();
    } else {
      this.collateralAppraisal = this.activatedRoute.snapshot.data['content'];
    }
    this.getBankAccount();
  }

  public dataBankAccount: IBankAcountModel;

  previousState(): void {
    this.router.navigate(['/bank-account']);
  }

  public goToSubMenu(menu: string): void {
    this.clickedMenu = menu;
  }

  public routeSubMenu(menu: object): void {
    this.router.navigate(['/bank-account', this.id, 'detail'], {
      queryParams: {
        subroute: menu['id'],
      },
    });
  }

  private getPositionTypeId(): void {
    this.positionService.find(this.getLocStor('POS')).subscribe(res => {
      this.positionTypeId = res.body.positionTypeId;
    });
  }

  public preSave() {
    const copyPartyCif: IPartyCif = lodash.cloneDeep(this.partyCif);

    if (typeof copyPartyCif.attributes['comparison'] !== 'string') {
      copyPartyCif.attributes['comparison'] = JSON.stringify(copyPartyCif.attributes['comparison']);
    }

    if (typeof copyPartyCif.attributes['industry'] !== 'string') {
      copyPartyCif.attributes['industry'] = JSON.stringify(copyPartyCif.attributes['industry']);
    }

    if (typeof copyPartyCif.attributes['shere-holde'] !== 'string') {
      copyPartyCif.attributes['shere-holder'] = JSON.stringify(copyPartyCif.attributes['shere-holder']);
    }

    if (copyPartyCif.customerPerson?.dob) {
      copyPartyCif.customerPerson.dob = this.partyCifStartState.customerPerson.dob;
    }

    // copyPartyCif.internalId = this.internalIdLocStor;

    return copyPartyCif;
  }

  private getLocStor(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }

  private logout(): void {
    this.loginService.logout();
    this.router.navigate(['']);
  }

  public save() {
    this.arrSliks = lodash.concat(this.arrSliks, this.TransferService.getparam());
    const removeundefined = lodash.remove(this.arrSliks, function (n) {
      return n === undefined;
    });

    this.partyCif.sliks = lodash.concat(this.partyCif.sliks, this.arrSliks);

    this.internalIdLocStor = this.getLocStor('INT');
    this.positionIdLocStor = this.getLocStor('POS');

    if (!this.internalIdLocStor || !this.positionIdLocStor) {
      this.logout();
    } else {
      if (!this.internalIdLocStor) {
        this.logout();
      } else {
        this.bankAccountService.update(this.preSave()).subscribe(res => {
          if (this.collateralInfo.length > 0) {
            for (let i = 0; i < this.collateralInfo.length; i++) {
              this.collateralService.save(this.collateralInfo[i]);
              if (this.collateralInfo.length === i) {
                this.collateralInfo = [];
              }
            }
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Save Success',
          });
        });
      }
    }
  }
  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.previousState();
      }
    });
  }
  public showTextMenu(): void {
    if (this.subMenu.length > 1) {
      const menuList = [];
      menuList.push(this.subMenu);
      for (let i = 0; i < menuList.length; i++) {
        for (let x = 0; x < menuList[i].length; x++) {
          if (this.clickedMenu === menuList[i][x].id) {
            return menuList[i][x].text;
          } else {
            for (let y = 0; y < menuList[i][x].child?.length; y++) {
              if (this.clickedMenu === menuList[i][x].child[y].id) {
                return menuList[i][x].child[y].text;
              }
            }
          }
        }
      }
    }
  }

  public triggerToggle() {
    this.isOpen = !this.isOpen;
  }

  openDialogBankAccount(parameter?: IBankAcountModel) {
    if (parameter) {
      this.dataBankAccount = parameter;
    } else {
      this.dataBankAccount = new BankAccountModel();
    }
    const dialog = this.dialog.open(BankAccountDialogComponent, {
      width: '80vw',
      autoFocus: false,
      data: {
        item: this.dataBankAccount,
      },
    });
    dialog.afterClosed().subscribe(res => {
      if (!res.id) {
        res.ownerId = this.partyCif.partyId;
        this.bankAccountService.createBankAccount(res).subscribe(_res => {
          this.getBankAccount();
        });
      } else {
        this.bankAccountService.updateBankAccount(res).subscribe(_res => {
          this.getBankAccount();
        });
      }
    });
  }

  public cifNumber: any;
  private getBankAccount() {
    this.cifNumber = this.partyCif.partyId;
    this.bankAccountService.getBankAccount(this.cifNumber).subscribe({
      // next: res => console.log('res', res),
      next: res => this.initDataForMatTable(res, res.headers),
      error: res => this.onError(res.message),
    });
  }

  protected postLoadDataLazy(): void {
    this.getBankAccount();
  }
}
