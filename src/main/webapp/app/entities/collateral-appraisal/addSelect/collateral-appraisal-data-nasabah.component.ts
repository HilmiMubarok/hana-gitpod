import { Component, ViewChild } from '@angular/core';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  private dialog: MatDialog;

  public onClickFind(): void {
    this.showCifList = true;
  }

  public onCreateSearchTextBox() {
    this.searchTextBox.addIcon('append', 'e-icons e-search');
    document.getElementsByClassName('e-search')[0].addEventListener('click', e => {
      this.searchInputOnEnter = this.searchInput;
    });
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
  // menu request appraisal
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
}
