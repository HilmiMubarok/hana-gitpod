import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ICertificateInfo } from './certificate-info.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';

@Component({
  selector: 'jhi-certificate-info',
  templateUrl: './certificate-info.component.html',
  styleUrls: ['./certificate-info.component.scss'],
})
export class CertificateInfoComponent implements OnInit {
  public dataItem: ICertificateInfo[] = [];
  public collateral: ICollateral;
  public creditProposal: ICreditProposal;
  public displayedColumns: string[] = ['no', 'buktiKepemilikan', 'jangkaWaktu', 'luasTanah', 'luasBangunan'];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cp: ICreditProposal;
      collateral: ICollateral;
    }
  ) {
    this.dataItem = data.cp.attributes['certificateInfoData'].filter(obj => obj.id === data.collateral.id);
    this.creditProposal = data.cp;
    this.collateral = data.collateral;
  }

  ngOnInit(): void {
    console.log('credit Proposal ', this.creditProposal);
  }

  public filterData() {
    this.dataItem = this.creditProposal.attributes['certificateInfoData'].filter(obj => obj.id === this.collateral.id);
  }
}
