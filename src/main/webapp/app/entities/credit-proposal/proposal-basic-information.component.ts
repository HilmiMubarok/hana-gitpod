import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreditProposalService } from './credit-proposal.service';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { FieldSettingsModel } from '@syncfusion/ej2-angular-navigations';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-credit-proposal',
  templateUrl: './proposal-basic-information.component.html',
  styleUrls: ['./proposal-basic-information.css'],
})
export class ProposalBasicInformationComponent implements OnInit {
  public proposalTypeList: string[] = ['Total Exposure < IDR 15 Bn', 'Total Exposure > IDR 15 Bn'];
  public proposalTypeValue?: string;
  public menuFields: FieldSettingsModel = {
    text: ['text'],
  };
  public creditProposalList?: ICreditProposal;
 
  public menuItems: MenuItemModel[] = [
    { text: 'BASIC INFORMATION' },
    { text: 'BUSINES ACTIVITY' },
    { text: 'LOAN FACILITY DETAIL' },
    { text: 'TAB EXPOSURE' },
    { text: 'ACCEPTENCE CRITERIA' },
    { text: 'MANAGEMENT INFO' },
    { text: 'SLIK SUMMARY' },
    { text: 'BANK ACCOUNT ANALYSIS' },
    { text: 'TAB REPAYMENT CAPABILITY' },
    { text: 'CORRESPONDENCE' },
  ];
  public selectedMenu?: string;

  public creditProposal?: ICreditProposal;

  constructor(private creditProposalService: CreditProposalService, protected activatedRoute: ActivatedRoute) {
    this.creditProposal = this.activatedRoute.snapshot.data['content'];
    this.creditProposalList = new CreditProposal();
  }

  ngOnInit(): void {
    this.selectedMenu = 'SLIK SUMMARY';

    this.creditProposalService.find(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: HttpResponse<ICreditProposal>) => {
      this.creditProposalList = res.body;
    })
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public previousState(): void {
    window.history.back();
  }

  public onGetCreditProposal(creditProposal: ICreditProposal): void {
    console.log('creditProposal @onGetCreditProposal - proposal-basic-information : ', creditProposal);
    this.creditProposal = creditProposal;
  }

  public onSave(): void {
    console.log('this.creditProposal onSave : ', this.creditProposal);
    for (let i = 0; i < this.creditProposal.products.length; i++) {
      this.creditProposal.products[i].attributes.maturityDate = '';
      this.creditProposal.products[i].attributes.dateOS = '';
      this.creditProposal.products[i].attributes.memoDate = '';
    }
    if (this.creditProposal.id) {
      this.creditProposalService.update(this.creditProposal).subscribe(res => {
        console.log('res update/PUT : ', res);
      });
    } else {
      this.creditProposalService.create(this.creditProposal).subscribe(res => {
        console.log('res create/POST : ', res);
      });
    }
    /* this.applicationProduct.attributes = {
	  nomorUrutFasilitas: '',
	  applicationType: '',
	  facilityType: '',
	  maturity: 0,
	  maturityPeriodType: '',
	  maturityDate: new Date(),
	  subLimit: false,
	  sublimitFromExistingFacility: '',
	  commitedLine: false,
	  currency: '',
	  kurs: 0,
	  initialLimit: 0,
	  outstanding: 0,
	  dateOS: new Date(),
	  changes: 0,
	  totalPlafond: 0,
	  restructuredStatus: false,
	  memoNo: '',
	  memoDate: new Date(),
	  keterangan: '',
	  interestRateType: '',
	  interestRatePeriodType: '',
	  indexRate: 0,
	  spreadOfMargin: 0,
	  totalRate: 0,
	  provitionFee: 0,
	  provitionFeeRateAmountType: '',
	  adminFee: 0,
	  adminFeeRateAmountType: '',
	  gracePeriod: 0,
	  gracePeriodType: '',
	  availableLimit: 0,
	  availablePeriod: '',
	  availablePeriodType: '',
	  instalmentEstimation: 0,
	  principalFrequency: 0,
	  principalFrequencyPeriodType: '',
	  loanPurpose: '',
	  remark: ''
	}; */
  }
}
