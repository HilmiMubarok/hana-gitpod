import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SUBMENU_PARTY_CIF } from 'app/shared/constants/base.constants';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';

import { IPartyCif } from './party-cif.model';

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
  public subMenu: object[];

  constructor(protected activatedRoute: ActivatedRoute, private router: Router) {
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
}
