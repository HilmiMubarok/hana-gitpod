import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { MY_DATE_FORMAT } from './legal-document-upload/document-dpdl-upload-dialog.component';
import { formatDate } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'yyy/MM/dd', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'jhi-dpdl-document-loan-operation',
  templateUrl: './dpdl-document-loan-operation.component.html',
  styleUrls: ['./document.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DpdlDocumentLoanOperationComponent implements OnChanges {
  public _creditProposal: ICreditProposal;

  @Input() isElement: Boolean = false;
  @Input() isLabel: Boolean = false;

  @Input()
  get creditProposal(): ICreditProposal {
    return this._creditProposal;
  }

  set creditProposal(value: ICreditProposal) {
    this._creditProposal = value;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isElement']) {
      this.isElement = changes['isElement'].currentValue;
    }

    if (changes['isLabel']) {
      this.isLabel = changes['isLabel'].currentValue;
    }
  }

  constructor(private router: Router, protected activatedRoute: ActivatedRoute) {}
}
