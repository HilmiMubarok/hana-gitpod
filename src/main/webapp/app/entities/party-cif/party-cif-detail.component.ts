import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

import { IPartyCif } from './party-cif.model';
import { PartyCifService } from './party-cif.service';
import { DebtorDataSlikTransferService } from '../debtor-data/slick-summary/debitur/debtor-data-silk-upload/debtor-data-slik-transfer.service';
import { ICollateral } from '../collateral/collateral.model';
import { CollateralService } from '../collateral/collateral.service';

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
  public collateralInfo: ICollateral[];
  public subMenu: object[];
  public arrSliks: Object[];

  constructor(
    protected messageService: MessageService,
    protected collateralService: CollateralService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    protected partyCifService: PartyCifService,
    private partySlikService: PartySlikService,
    private TransferService: DebtorDataSlikTransferService
  ) {
    this.partyCif = this.activatedRoute.snapshot.data['content'];
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
    this.collateralAppraisal = this.activatedRoute.snapshot.data['content'];
  }

  previousState(): void {
    this.router.navigate(['/party-cif']);
  }

  public goToSubMenu(menu: string): void {
    this.clickedMenu = menu;
  }

  public routeSubMenu(menu: object): void {
    this.router.navigate(['/party-cif', this.id, 'detail'], { queryParams: { subroute: menu['id'] } });
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

    return copyPartyCif;
  }

  private updateSliks(slik: IPartySlik): Promise<void> {
    return new Promise((resolve, reject) => {
      this.partySlikService.update(slik).subscribe(res => {
        resolve();
      });
    });
  }

  private createSliks(slik: IPartySlik): Promise<void> {
    return new Promise((resolve, reject) => {
      this.partySlikService.create(slik).subscribe(res => {
        resolve();
      });
    });
  }

  public save() {
    this.arrSliks = lodash.concat(this.arrSliks, this.TransferService.getparam());
    const removeundefined = lodash.remove(this.arrSliks, function (n) {
      return n === undefined;
    });

    console.log('sliks', this.arrSliks);

    this.partyCif.sliks = lodash.concat(this.partyCif.sliks, this.arrSliks);

    // console.log("sliks",this.TransferService.getSliks());

    // console.log("collateral info", this.partyCif.collaterals);

    this.partyCifService.update(this.preSave()).subscribe(res => {
      // console.log("ini presave", this.preSave());

      if (this.collateralInfo.length > 0) {
        for (let i = 0; i < this.collateralInfo.length; i++) {
          this.collateralService.save(this.collateralInfo[i]);
          if (this.collateralInfo.length === i) {
            this.collateralInfo = [];
          }
        }
      }
      const createSliksPromises = [];
      const updateSliksPromises = [];
      for (let i = 0; i < this.partyCif.sliks.length; i++) {
        if (this.partyCif.sliks[i].id) {
          updateSliksPromises.push(this.updateSliks(this.partyCif.sliks[i]));
        } else {
          createSliksPromises.push(this.createSliks(this.partyCif.sliks[i]));
        }
      }
      Promise.all(updateSliksPromises).then(results => {
        Promise.all(createSliksPromises).then(results2 => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Save Success',
          });
        });
      });
    });
  }
}
