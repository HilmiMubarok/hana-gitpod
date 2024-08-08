import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Input as InputE } from '@syncfusion/ej2-inputs';

@Component({
  selector: 'jhi-textbox-numeric-formated-readonly',
  templateUrl: './text-box-component.html',
  styleUrls: ['./scss/text-box.component.scss'],
})
export class TextBoxNumericFormatedReadOnlyComponent implements OnInit {
  @Input() nameP: string;
  @Input() valP: number;
  @Output() outputVal = new EventEmitter();

  name: string;
  inputVal: number;

  ngOnInit() {
    this.name = this.nameP;

    if (this.valP) {
      this.inputVal = this.valP;
    }
  }

  change(val: any): void {
    this.outputVal.emit(this.inputVal);
  }
}
