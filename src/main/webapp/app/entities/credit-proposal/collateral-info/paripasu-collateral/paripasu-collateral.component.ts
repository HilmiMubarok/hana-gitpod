import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-paripasu-collateral',
  templateUrl: './paripasu-collateral.component.html',
  styleUrls: ['../collateral-info-cp.style.scss'],
})
export class ParipasuCollateralComponent {
  public displayedColumns: string[] = ['no', 'cif', 'debtorNames'];
  public data = [];
}
