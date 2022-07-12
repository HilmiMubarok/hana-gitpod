import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'jhi-button',
  templateUrl: './button-component.html',
  styleUrls: ['./scss/button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() typeB: string;
  @Output() clickEv = new EventEmitter();

  classTypeB: string;
  nameTypeB: string;

  ngOnInit() {
    this.setTypeB();
  }

  setTypeB(): void {
    if (this.typeB === 'primary') {
      this.classTypeB = 'btn btn-primary';
    } else if (this.typeB === 'info') {
      this.classTypeB = 'btn btn-info';
      this.nameTypeB = 'Save';
    } else if (this.typeB === 'danger') {
      this.classTypeB = 'btn btn-danger';
      this.nameTypeB = 'Cancel';
    } else if (this.typeB === 'warning') {
      this.classTypeB = 'btn btn-warning';
    } else if (this.typeB === 'secondary') {
      this.classTypeB = 'btn btn-secondary';
    }
  }

  onClick(): void {
    this.clickEv.emit();
  }
}
