import { Component, OnInit, ViewChild } from '@angular/core';
import { ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
@Component({
  selector: 'jhi-credit-proposal-list',
  templateUrl: './credit-proposal-list-component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalListComponent extends AbstractEntityEj2GridComponent<ICreditProposal> {
  public data: object[];
  public toolbarOptions: ToolbarItems[];

  constructor(protected creditProposalService: CreditProposalService) {
    super(creditProposalService);
  }

  ngOnInit(): void {
    this.toolbarOptions = ['Search'];
    this.getData();
  }

  getData(): void {
    this.creditProposalService.query().subscribe(response => (this.data = response.body));
  }
}
