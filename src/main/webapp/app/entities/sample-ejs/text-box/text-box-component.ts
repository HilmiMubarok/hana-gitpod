import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'jhi-textbox',
  templateUrl: './text-box-component.html',
  styleUrls: ['./scss/text-box.component.scss'],
})
export class TextBoxComponent implements OnInit {
  @Input() fieldNameT: string;
  @Input() fieldTypeT: string;

  @Output() outputVal = new EventEmitter();

  nameT: string;
  classTypeT: string;

  inputVal: any;

  ngOnInit() {
    this.nameT = this.fieldNameT;
    //this.setTypeT();
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

  /*setTypeT(): void {
		if(this.fieldTypeT === 'primary'){
			this.classTypeT = 'primary';
		}else if(this.fieldTypeT === 'info'){
			this.classTypeT = 'info';
		}else if(this.fieldTypeT === 'danger'){
			this.classTypeT = 'danger';
		}else if(this.fieldTypeT === 'warning'){
			this.classTypeT = 'warning';
		}else if(this.fieldTypeT === 'secondary'){
			this.classTypeT = 'secondary';
		}
	}*/
}
