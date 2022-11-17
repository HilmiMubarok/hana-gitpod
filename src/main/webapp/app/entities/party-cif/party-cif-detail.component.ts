import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SUBMENU_PARTY_CIF } from 'app/shared/constants/base.constants';
import lodash from 'lodash';
import { MessageService } from 'primeng/api';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { PartyGroup } from '../party-group/party-group.model';
import { Person } from '../person/person.model';

import { IPartyCif, PartyCif } from './party-cif.model';
import { PartyCifService } from './party-cif.service';

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

  constructor(
    protected messageService: MessageService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private partyCifService: PartyCifService
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

  private preSave(): IPartyCif {
    const copyPartyCif: IPartyCif = lodash.cloneDeep(this.partyCif);

    if (typeof copyPartyCif.attributes['comparison'] !== 'string') {
      copyPartyCif.attributes['comparison'] = JSON.stringify(copyPartyCif.attributes['comparison']);
    }

    if (typeof copyPartyCif.attributes['industry'] !== 'string') {
      copyPartyCif.attributes['industry'] = JSON.stringify(copyPartyCif.attributes['industry']);
    }

    if (typeof copyPartyCif.attributes['shere-holder'] !== 'string') {
      copyPartyCif.attributes['shere-holder'] = JSON.stringify(copyPartyCif.attributes['shere-holder']);
    }

    return copyPartyCif;
  }

  public save() {
    console.log(this.preSave());

    if (this.partyCif.id) {
      this.partyCifService.update(this.preSave()).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
      });
    }
  }
}
