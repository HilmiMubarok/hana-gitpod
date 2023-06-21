import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ICertificateInfo } from './certificate-info.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CertificateInfoDialogComponent } from './certificate-info-dialog.component';

@Component({
  selector: 'jhi-certificate-info',
  templateUrl: './certificate-info.component.html',
  styleUrls: ['./certificate-info.component.scss'],
})
export class CertificateInfoComponent implements OnInit {
  public dataItem: ICertificateInfo[] = [];
  public collateral: ICollateral;
  public creditProposal: ICreditProposal;
  public displayedColumns: string[] = ['no', 'buktiKepemilikan', 'jangkaWaktu', 'luasTanah', 'luasBangunan', 'action'];
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cp: ICreditProposal;
      collateral: ICollateral;
    }
  ) {
    if (data.cp.attributes['certificateInfoData']) {
      if (data.cp.attributes['certificateInfoData'].length > 0) {
        const filter: ICertificateInfo[] = data.cp.attributes['certificateInfoData'].filter(obj => obj.id === data.collateral.id);
        if (filter) {
          this.dataItem = filter;
        }
      }
    }
    this.creditProposal = data.cp;
    this.collateral = data.collateral;
  }

  ngOnInit(): void {
    console.log('credit Proposal ', this.creditProposal);
    console.log('ini collateral di certificate ', this.collateral);
  }

  public openDialog(params: ICertificateInfo) {
    const dialogRef = this.dialog.open(CertificateInfoDialogComponent, {
      width: '80vw',
      data: {
        certifacteInfo: params,
      },
    });
    dialogRef.afterClosed().subscribe((data: ICertificateInfo) => {
      console.log(data);
    });
  }
}
