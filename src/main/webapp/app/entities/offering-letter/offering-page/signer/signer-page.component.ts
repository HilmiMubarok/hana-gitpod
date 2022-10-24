import { Component, Inject, Input } from '@angular/core';
import { PositionService } from 'app/entities/position/position.service';
import { APPLICATION_TYPE, POSITION_TYPE } from 'app/shared/constants/base.constants';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { OfferingLetterSignerPageDialogComponent } from './dialog/signer-page-dialog.component';
// import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-signer-page',
  templateUrl: './signer-page.component.html',
  styleUrls: ['../offering-page.css'],
})
export class OfferingLetterSignerPageComponent {
  public displayColumns: string[] = ['no', 'name', 'debtor', 'action'];
  public loading: boolean;

  constructor(private positionService: PositionService, public dialog: MatDialog) {
    this.loading = false;
  }

  openDialog() {
    const dialogRef = this.dialog.open(OfferingLetterSignerPageDialogComponent, {
      width: '80vw',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        //  console.log('cek')
      }
    });
  }

  onDelete() {}
}
