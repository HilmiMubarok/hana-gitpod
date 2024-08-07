import { Component, Inject, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOrganizationLegal } from '../organization-legal/organization-legal.model';
import { OrganizationLegalService } from '../organization-legal/organization-legal.service';
import { PartyCifService } from '../party-cif/party-cif.service';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';

@Component({
  selector: 'jhi-credit-proposal-dialog-borrower',
  templateUrl: './credit-proposal-dialog-borrower.component.html',
  styleUrls: ['./credit-proposal-dialog-borrower.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogBorrowerComponent implements OnInit {
  public creditProposal: ICreditProposal;
  public organizationLegal: IOrganizationLegal[];

  public deeedDataNumber: any;
  public deedDataDate: any;
  @Input()
  creditProposalItem: ICreditProposal = new CreditProposal();

  @Input()
  get dataSource() {
    return this.organizationLegal;
  }
  set dataSource(param: IOrganizationLegal[]) {
    this.organizationLegal = param;
  }

  constructor(
    private creditProposalService: CreditProposalService,
    private organizationLegalService: OrganizationLegalService,
    private partyCifService: PartyCifService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: any;
      cp: ICreditProposal;
    }
  ) {}

  ngOnInit(): void {
    this.getPDataNumber();
    this.getDataDate();
  }

  public getPDataNumber() {
    this.partyCifService.find('cif/' + this.data.item.customerNumber).subscribe((res: any) => {
      this.loadDataByNumber(this.partyCifService.findPartyId(res.body));
    });
  }

  public getDataDate() {
    this.partyCifService.find('cif/' + this.data.item.customerNumber).subscribe((res: any) => {
      this.loadDataByDate(this.partyCifService.findPartyId(res.body));
    });
  }

  public loadDataByNumber(_idOrganization: string = null): void {
    this.organizationLegalService
      .queryFilterBy({
        idOrganization: _idOrganization,
        page: 0,
        sort: ['id,desc'],
      })
      .subscribe((res: any) => {
        this.deeedDataNumber = res.body[0].deedEstablishNum;
      });
  }

  public loadDataByDate(_idOrganization: string = null): void {
    this.organizationLegalService
      .queryFilterBy({
        idOrganization: _idOrganization,
        page: 0,
        sort: ['id,desc'],
      })
      .subscribe((res: any) => {
        this.deedDataDate = res.body[0].deedEstablishDate;
      });
  }
}
