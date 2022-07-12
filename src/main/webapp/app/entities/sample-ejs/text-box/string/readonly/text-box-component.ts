import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Input as InputE } from '@syncfusion/ej2-inputs';

@Component({
  selector: 'jhi-textbox-string-readonly',
  templateUrl: './text-box-component.html',
  styleUrls: ['./scss/text-box.component.scss'],
})
export class TextBoxStringReadOnlyComponent implements OnInit {
  @Input() nameP: string;
  @Input() valP: string;
  @Output() outputVal = new EventEmitter();

  name: string;
  inputVal: string;

  ngOnInit() {
    this.name = this.nameP;

    if (this.valP) {
      this.inputVal = this.valP;
    }
  }

  //this.outputVal.emit(this.inputVal);

  change(val: any): void {
    /*if (this.max) {
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

    this.outputVal.emit(this.inputVal);
  }
}
