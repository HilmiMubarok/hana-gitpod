import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CertificateInfo, ICertificateInfo } from './certificate-info.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CertificateInfoDialogComponent } from './certificate-info-dialog.component';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { Router } from '@angular/router';
import moment from 'moment';
import { formatDateDob } from 'app/shared/helper/utils';
@Component({
  selector: 'jhi-certificate-info',
  templateUrl: './certificate-info.component.html',
  styleUrls: ['./certificate-info.component.scss'],
})
export class CertificateInfoComponent implements OnInit {
  public dataItem: ICertificateInfo[] = [];
  public collateral: ICollateral;
  public creditProposal: ICreditProposal;
  public filter: ICertificateInfo[];
  public parentPath = this.router.url.split('/')[1];
  public displayedColumns: string[] = ['no', 'buktiKepemilikan', 'jangkaWaktu', 'luasTanah', 'luasBangunan', 'action'];
  constructor(
    private router: Router,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cp: ICreditProposal;
      collateral: ICollateral;
    }
  ) {
    this.creditProposal = data.cp;
    this.collateral = data.collateral;
  }
  ngOnInit(): void {
    if (this.creditProposal.attributes['certificateInfoData']) {
      if (this.creditProposal.attributes['certificateInfoData'].length > 0) {
        this.filter = this.creditProposal.attributes['certificateInfoData'].filter(obj => obj.id === this.collateral.id);
        if (this.filter) {
          this.dataItem = this.filter;
        }
      }
    }
  }

  public openDialog(params?: ICertificateInfo) {
    if (!params) {
      params = new CertificateInfo();
    }
    const dialogRef = this.dialog.open(CertificateInfoDialogComponent, {
      width: '80vw',
      data: {
        certifacteInfo: params,
      },
    });
    dialogRef.afterClosed().subscribe((data: ICertificateInfo) => {
      if (!data.id) {
        if (data.jangkaWaktuKepemilikan) {
          data.jangkaWaktuKepemilikan = moment(new Date(data.jangkaWaktuKepemilikan)).format().substring(0, 19) + 'Z';
        }
        data.id = this.collateral.id;
        if (this.creditProposal.attributes['certificateInfoData'].length !== 0) {
          data.index = this.creditProposal.attributes['certificateInfoData'].length + 1;
        } else {
          data.index = this.creditProposal.attributes['certificateInfoData'][0];
        }
        this.creditProposal.attributes['certificateInfoData'].push(data);
        this.dataItem = this.creditProposal.attributes['certificateInfoData'].filter(obj => obj.id === this.collateral.id);
      }
    });
  }
  public onDelete(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Facility Detail Data',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.creditProposal.attributes['certificateInfoData'] = this.creditProposal.attributes['certificateInfoData'].filter(
          obj => obj.index !== element.index
        );
        this.dataItem = this.creditProposal.attributes['certificateInfoData'].filter(obj => obj.id === this.collateral.id);
      }
    });
  }
}
