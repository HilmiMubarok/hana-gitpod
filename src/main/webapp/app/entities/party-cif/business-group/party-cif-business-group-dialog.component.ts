import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IPartyCif } from '../party-cif.model';
import { PartyCifService } from '../party-cif.service';

@Component({
  selector: 'jhi-party-cif-business-group-dialog',
  templateUrl: './party-cif-business-group-dialog.component.html',
})
export class PartyCifBusinessGroupDialogComponent {
  public selectedPartyCif: IPartyCif;
  public cif: string;
  public view: boolean;
  constructor(private partyCifService: PartyCifService, private _dialog: MatDialogRef<PartyCifBusinessGroupDialogComponent>) {}

  public save(): void {
    this._dialog.close(this.selectedPartyCif.debtorData);
  }

  public findCif(): void {
    this.selectedPartyCif = undefined;
    this.partyCifService.findPartyGroupByCif(this.cif).subscribe(res => {
      this.selectedPartyCif = res.body;
    });
  }
}
