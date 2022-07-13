import { Component, OnInit } from '@angular/core';

import { ICif, Cif } from './cif.model';
import { CifService } from './cif.service';
@Component({
  selector: 'jhi-cif-view-custom',
  templateUrl: './cif-view-custom.component.html',
})
export class CifViewCustomComponent implements OnInit {
  constructor(private cifService: CifService) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
