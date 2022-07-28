import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'jhi-textbox',
  templateUrl: './text-box-component.html',
  styleUrls: ['./scss/text-box.component.scss'],
})
export class TextBoxComponent implements OnInit {
  @Input() nameP: string;
  @Input() dataTypeP: string;
  @Input() dataFormatP: string;
  @Input() isReadOnlyP: boolean;
  @Input() valSP: string;
  @Input() valNP: number;
  @Output() outputValSP = new EventEmitter();
  @Output() outputValNP = new EventEmitter();

  name: string;
  dataType: string;
  dataFormat: string;
  isReadOnly: boolean;
  valS: string;
  valN: number;

  floatType = 'Auto';

  ngOnInit() {
    this.name = this.nameP;
    this.dataType = this.dataTypeP;
    this.isReadOnly = this.isReadOnlyP;
    this.dataFormat = this.dataFormatP;

    if (this.valSP && this.dataType === 'string') {
      this.valS = this.valSP;
    }

    if (this.valNP && this.dataType === 'number') {
      this.valN = this.valNP;
    }
  }

  // this.outputVal.emit(this.inputVal);

  change(val: any): void {
    /* if (this.max) {
		if (val > this.max) {
			this.inputVal = this.max;
			this.outputVal.emit(this.inputVal);
			return;
		}
	}

	if (this.min) {
	  if (value < this.min) {
		this.inputVal = this.min;
		this.outputVal.emit(this.inputVal);
		return;
	  }
	}
	this.inputVal = val;*/

    if (this.dataType === 'string') {
      this.outputValSP.emit(this.valS);
    }

    if (this.dataType === 'number') {
      this.outputValNP.emit(this.valN);
    }
  }
}
