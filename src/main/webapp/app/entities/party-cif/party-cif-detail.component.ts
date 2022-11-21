import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SUBMENU_PARTY_CIF } from 'app/shared/constants/base.constants';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { IDebtorData } from '../debtor-data/debtor-data.model';
import { DebtorDataService } from '../debtor-data/debtor-data.service';
import { OrganizationCustomer } from '../organization-customer/organization-customer.model';
import { OrganizationCustomerService } from '../organization-customer/organization-customer.service';
import { IPerson } from '../person/person.model';
import { IPersonalCustomer, PersonalCustomer } from '../personal-customer/personal-customer.model';
import { PersonalCustomerService } from '../personal-customer/personal-customer.service';

import { IPartyCif } from './party-cif.model';

@Component({
  selector: 'jhi-party-cif-detail',
  templateUrl: './party-cif-detail.component.html',
  styleUrls: ['./party-cif.style.scss'],
})
export class PartyCifDetailComponent implements OnInit {
  private customerPerson: IPersonalCustomer;
  private debtorData: IDebtorData;
  private id: string;
  public collateralAppraisal: ICollateralAppraisal;
  public clickedMenu: string;
  public partyCif: IPartyCif | null = null;
  public subMenu: object[];

  constructor(
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    protected customerOrganizationService: OrganizationCustomerService,
    protected customerPersonService: PersonalCustomerService,
    protected debtordataService: DebtorDataService
  ) {
    this.partyCif = this.activatedRoute.snapshot.data['content'];
    this.clickedMenu = 'customer-info';
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

  // public customerPersonPresave(){
  //   this.customerPerson.id = this.partyCif.id;

  //   return this.customerPerson;
  // }

  // public organizationCustomerPreSave(){
  //   log
  // }

  public save() {
    // if(this.partyCif.customerPerson){
    //   this.customerPersonService.update(this.customerPersonPresave()).subscribe(res =>{
    //     console.log(res.body);
    //   });
    // }

    // if(this.partyCif.customerOrganization){
    //   console.log("organiztion customer");
    // }

    this.debtordataService.update(this.partyCif.debtorData).subscribe(res => {
      console.log('Save succesed', res.body);
    });

    console.log(this.partyCif);
  }
}
