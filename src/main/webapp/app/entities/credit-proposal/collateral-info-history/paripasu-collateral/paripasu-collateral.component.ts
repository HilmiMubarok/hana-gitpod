import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-paripasu-collateral-history',
  templateUrl: './paripasu-collateral.component.html',
  styleUrls: ['../collateral-info-cp.style.scss'],
})
export class ParipasuCollateralHistoryComponent {
  public displayedColumns: string[] = ['no', 'cif', 'debtorNames', 'facilityType', 'ccy', 'totalPlafond', 'os'];
  public data = [];
}
