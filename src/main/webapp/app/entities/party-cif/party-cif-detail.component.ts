import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SUBMENU_PARTY_CIF } from 'app/shared/constants/base.constants';
import lodash, { update } from 'lodash';
import { MessageService } from 'primeng/api';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { IDebtorData } from '../debtor-data/debtor-data.model';
import { DebtorDataService } from '../debtor-data/debtor-data.service';
import { OrganizationCustomer } from '../organization-customer/organization-customer.model';
import { OrganizationCustomerService } from '../organization-customer/organization-customer.service';
import { IPartySlik, PartySlik } from '../party-slik/party-slik.model';
import { IPerson } from '../person/person.model';
import { IPersonalCustomer, PersonalCustomer } from '../personal-customer/personal-customer.model';
import { PersonalCustomerService } from '../personal-customer/personal-customer.service';
import { PartySlikService } from '../party-slik/party-slik.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

import { IPartyCif } from './party-cif.model';
import { PartyCifService } from './party-cif.service';
import { DebtorDataSlikTransferService } from '../debtor-data/slick-summary/debitur/debtor-data-silk-upload/debtor-data-slik-transfer.service';
import { ICollateral } from '../collateral/collateral.model';
import { CollateralService } from '../collateral/collateral.service';
import { LoginService } from 'app/login/login.service';
import { PositionService } from '../position/position.service';

@Component({
  selector: 'jhi-party-cif-detail',
  templateUrl: './party-cif-detail.component.html',
  styleUrls: ['./party-cif.style.scss'],
})
export class PartyCifDetailComponent implements OnInit {
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
  public title: string;
  public titleMenu: string;
  public titleUrl: any;
  appName: any;
  appNameMenu: any;
  public parentPath = this.router.url.split('/')[1];
  public value: string;

  constructor(
    private dialog: MatDialog,
    protected messageService: MessageService,
    protected collateralService: CollateralService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    protected partyCifService: PartyCifService,
    protected loginService: LoginService,
    private partySlikService: PartySlikService,
    private TransferService: DebtorDataSlikTransferService,
    private positionService: PositionService
  ) {
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
  }

  previousState(): void {
    this.router.navigate(['/party-cif']);
  }

  public goToSubMenu(menu: string): void {
    this.clickedMenu = menu;
  }

  public routeSubMenu(menu: object): void {
    this.router.navigate(['/party-cif', this.id, 'detail'], {
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
        this.partyCifService.update(this.preSave()).subscribe(res => {
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

  getTextMenu() {
    if (this.clickedMenu === 'party-cif') {
      this.titleMenu = 'Initial Debtor Data';
      // sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'customer-info') {
      this.titleMenu = 'Customer Info';
      // sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'organization-legal') {
      this.titleMenu = 'Organization Legal';
      // sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'business-group') {
      this.titleMenu = 'Business Group';
      // sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'management-data') {
      this.titleMenu = 'Management / Shareholder';
      // sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'document-checklist') {
      this.titleMenu = 'Document Checklist';
      // sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'facility-info') {
      this.titleMenu = 'Facility Info';
      // sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'collateral-info') {
      this.titleMenu = 'Collateral Info';
      // sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'financial-info') {
      this.titleMenu = 'Upload';
      // sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'retrive-info') {
      this.titleMenu = 'Retrive';
      // sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'credit-rating') {
      this.titleMenu = 'Credit Rating';
      // sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'slik') {
      this.titleMenu = 'Slik';
      // sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'decision-approval-report') {
      this.titleMenu = 'Decision Approval Report';
      // sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    return this.titleMenu;
  }

  // getTitleMenu() {
  //   this.appNameMenu = sessionStorage.getItem('appNameMenu');
  // }

  getTitleUrl() {
    const x = this.router.url.split('/')[3].slice(0, 4).split('?');

    this.titleUrl = x;
  }
}
