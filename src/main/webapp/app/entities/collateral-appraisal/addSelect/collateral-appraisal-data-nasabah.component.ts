import { Component } from '@angular/core';

@Component({
  selector: 'jhi-appraisal-data-nasabah',
  templateUrl: './collateral-appraisal-data-nasabah.component.html',
  styleUrls: ['./collateral-appraisal-data-nasabah.css'],
})
export class CollateralAppraisalDataNasabahComponent {
  public searchInput?: string;
  public showCifList = false;

  public onClickFind(): void {
    this.showCifList = true;
  }
}
