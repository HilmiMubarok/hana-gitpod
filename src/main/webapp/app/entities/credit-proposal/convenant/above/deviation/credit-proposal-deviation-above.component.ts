import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantAbove } from '../../convenant.constant';
import lodash from 'lodash';
import { StorageService } from 'app/entities/storage/storage.service';
@Component({
  selector: 'jhi-credit-proposal-deviation-above',
  templateUrl: './credit-proposal-deviation-above.component.html',
  styleUrls: ['../../back-to-back/covenant-backtoback.css'],
})
export class CreditProposalDeviationAboveComponent implements OnInit, OnChanges {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['To be waived', 'Waived'];
  public readonly = true;
  public standardDataGridAbove: any = dataCovenantAbove;
  public copystandardDataGridAbove: any = dataCovenantAbove;

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];

  constructor(public storageService: StorageService) {}

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  public onKeyUpEvent(input: string, event: any, data: any) {
    for (let i = 0; i < this.copystandardDataGridAbove.length; i++) {
      if (i === Number(data.index)) {
        this.copystandardDataGridAbove[i].status = input === 'status' ? event.value : this.standardDataGridAbove[i].status;
        this.copystandardDataGridAbove[i].deviation = input === 'deviation' ? event.target.value : this.standardDataGridAbove[i].deviation;
        this.copystandardDataGridAbove[i].justification =
          input === 'justification' ? event.target.value : this.standardDataGridAbove[i].justification;
      } else {
        this.copystandardDataGridAbove[i].status = this.statusValue[i];
        this.copystandardDataGridAbove[i].deviation = this.deviation[i];
        this.copystandardDataGridAbove[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridAbove = lodash.clone(this.copystandardDataGridAbove);
  }

  public folders = [];
  public dataFolder = [];
  private groupByFolder(param: any[]): void {
    this.folders = [];
    if (param.length > 0) {
      this.folders = lodash
        .chain(param)
        .groupBy('tags.document')
        .map((val, key) => ({
          folder: key,
          key: val[0].key,
          data: val,
          documentType: val[0]['tags']['documentType'],
          document: val[0]['tags']['document'],
          category: val[0]['tags']['category'],
          dueDate: val[0]['tags']['dueDate'],
          status: val[0]['tags']['status'],
          remarks: val[0]['tags']['remarks'],

          files: val,
        }))
        .value();

      for (let i = 0; i < this.folders.length; i++) {
        const setdata = {
          no: this.folders.length + 1,
          covenant: this.folders[i].document,
          status: this.folders[i].status,
          deviation: this.folders[i].category,
          formGroub: true,
          justification: '',
        };

        this.standardDataGridAbove = [...this.standardDataGridAbove, setdata];
      }
    } else {
      this.folders = [];
    }
  }

  private getFiles(id: number): void {
    const predicate: Object = {
      key: `/credit_proposal/${id}/document`,
    };
    this.storageService.getBucketName().subscribe((res: any) => {
      this.storageService.getObjects(res.body.bucket, predicate).subscribe(a => {
        this.groupByFolder(a.body);
      });
    });
  }

  ngOnInit(): void {
    this.getFiles(this.creditProposalItem.id);
    if (this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length !== 0) {
      const deletedItem = this.creditProposalItem.attributes['convenant'].standardDataGridAbove.filter(item => item.status !== 'Applied');
      this.standardDataGridAbove = deletedItem;
      for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length; i++) {
        this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].status;
        this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].deviation;
        this.justification[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].justification;
      }
    } else {
      this.standardDataGridAbove = [];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.standardDataGridAbove = [
      ...this.standardDataGridAbove,
      changes.creditProposalItem.currentValue.attributes['convenant'].standardDataGridAbove,
    ];
  }
}
