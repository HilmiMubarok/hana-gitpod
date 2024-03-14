import { Component, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'jhi-generate-tbo-legal-monitoring',
  templateUrl: './generate-tbo-legal-monitoring.component.html',
  styleUrls: ['./generate-tbo-legal-monitoring.style.scss'],
})
export class GenerateTboLegalMonitoringComponent {
  @Input('item')
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  public isDataExist = false;
  public paramId: string;
  private ngUnsubscribe = new Subject();
  private BUCKET: string;
  private KEYG = 'credit_proposal/memo_banding';
  public _item?: ICreditProposal = new CreditProposal();
  public fileTypeSelected: string;
  public data: object[];
  public fileTypeList: string[] = ['excel'];
  public displayColumns: string[] = ['no', 'fileName', 'date', 'createBy', 'sizeFile', 'action'];

  public generate(data: any): void {}
}
