import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CpMemoBandingService } from '../../services/cp-memo-banding.service';

@Component({
  selector: 'jhi-cp-memo-banding-other-covenant',
  templateUrl: './cp-memo-banding-other-covenant.component.html',
  styleUrls: ['../../../convenant/other-covenant/other-covenant.css'],
})
export class CpMemoBandingOtherCovenantComponent implements OnInit {
  public _creditProposalItem: ICreditProposal;

  dataSource;
  parsed;
  getData() {
    this.parsed = this.cpMemoBandingservice.parsePrevOfferingLetter(this.creditProposalItem);
    this.dataSource = this.cpMemoBandingservice.compareOtherCovenant(
      this.parsed.convenant['otherCovenant'],
      this.creditProposalItem.attributes['convenant']['otherCovenant']
    );
    console.log('datasour', this.dataSource);
  }
  ngOnInit() {
    this.getData();
  }

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  public displayColumns: string[] = ['no', 'category', 'sub_category', 'covenant', 'status', 'deviation', 'justification', 'action'];

  constructor(public dialog: MatDialog, private cpMemoBandingservice: CpMemoBandingService) {}
}
