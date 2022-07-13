import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'jhi-ribbon',
  templateUrl: './ribbon-component.html',
  styleUrls: ['./scss/ribbon.component.scss'],
})
export class RibbonComponent implements OnInit {
  @Input() ribbonN: string;

  nameR: string;

  ngOnInit() {
    this.nameR = this.ribbonN;
  }
}
