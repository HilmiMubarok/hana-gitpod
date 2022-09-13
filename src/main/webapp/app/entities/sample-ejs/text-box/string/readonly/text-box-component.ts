import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  change(val: any): void {
    this.outputVal.emit(this.inputVal);
  }
}
