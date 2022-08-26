import { Component, ViewChild } from '@angular/core';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';

@Component({
  selector: 'jhi-appraisal-data-nasabah',
  templateUrl: './collateral-appraisal-data-nasabah.component.html',
  styleUrls: ['./collateral-appraisal-data-nasabah.css'],
})
export class CollateralAppraisalDataNasabahComponent {
  @ViewChild('searchTextBox') public searchTextBox: TextBoxComponent;
  public searchInput?: string;
  public searchInputOnEnter?: string;
  public showCifList = false;

  public onClickFind(): void {
    this.showCifList = true;
  }

  public onCreateSearchTextBox() {
    this.searchTextBox.addIcon('append', 'e-icons e-search');
  }

  public onKeyUpSearchBox(args: any): void {
    if (args.key === 'Enter') {
      this.searchInputOnEnter = this.searchInput;
    } else {
      this.searchInputOnEnter = '';
    }
  }

  public previousState(): void {
    window.history.back();
  }
}
