import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPartyCif } from './party-cif.model';

@Component({
  selector: 'jhi-party-cif-detail',
  templateUrl: './party-cif-detail.component.html',
  styleUrls: ['./party-cif.style.scss'],
})
export class PartyCifDetailComponent {
  public clickedMenu: string;
  public partyCif: IPartyCif | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {
    this.partyCif = this.activatedRoute.snapshot.data['content'];
    this.clickedMenu = 'customer-info';
  }

  previousState(): void {
    window.history.back();
  }

  public goToSubMenu(menu: string): void {
    this.clickedMenu = menu;
  }
}
