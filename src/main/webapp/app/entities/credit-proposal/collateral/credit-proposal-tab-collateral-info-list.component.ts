import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter, Query } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { CreditProposalService } from '../credit-proposal.service';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-collateral-info-list',
  templateUrl: './credit-proposal-tab-collateral-info-list.component.html',
  styleUrls: ['./credit-proposal-tab-collateral-info-list.css'],
})
export class CreditProposalTabCollateralInfoListComponent {
  public _creditProposal: ICreditProposal;

  public numericFormatOptions: Object;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  private collateralRowInfoTemplate = {
    collateralType: '',
    marketability: '',
    address: '',
    internalAppraisalMv: 0,
    internalAppraisalLv: 0,
    KJPPMv: '',
    KJPPMl: '',
    okupansi: '',
    ownership: '',
    certifiedDueDate: new Date(),
  };

  public collateralRowInfo = {
    collateralType: '',
    marketability: '',
    address: '',
    internalAppraisalMv: 0,
    internalAppraisalLv: 0,
    KJPPMv: '',
    KJPPMl: '',
    okupansi: '',
    ownership: '',
    certifiedDueDate: new Date(),
  };

  @ViewChild('ejAddDialog') ejAddDialog: DialogComponent;
  @ViewChild('ejDetailDialog') ejDetailDialog: DialogComponent;

  public dialogAddVisible = false;
  public width = '90%';
  public height = 'auto';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  constructor(protected creditProposalService: CreditProposalService) {}

  onOpenDialog(data: any): void {
    this.collateralRowInfo = lodash.clone(this.collateralRowInfoTemplate);
    this.collateralRowInfo.collateralType = data.collateralTypeDescription;
    this.collateralRowInfo.address = data.collateralAddress.address1;
    this.collateralRowInfo.internalAppraisalMv = data.marketValue;
    this.collateralRowInfo.internalAppraisalLv = data.marketValueTataKota;
    this.collateralRowInfo.certifiedDueDate = data.certificateDateFrom;
    this.ejAddDialog.show();
  }

  onOpen(args: any) {
    args.preventFocus = true;
  }

  public onBeforeOpen = function (args: any): void {
    args.maxHeight = '700px';
  };

  public onOverlayClick(): void {
    this.ejAddDialog.hide();
  }

  ngOnInit(): void {
    this.numericFormatOptions = { format: 'N' };
  }
}
