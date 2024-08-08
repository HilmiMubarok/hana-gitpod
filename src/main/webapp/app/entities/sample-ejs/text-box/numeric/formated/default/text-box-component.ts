import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'jhi-textbox-numeric-formated',
  templateUrl: './text-box-component.html',
  styleUrls: ['./scss/text-box.component.scss'],
})
export class TextBoxNumericFormatedComponent implements OnInit {
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
