import { Component, OnInit } from '@angular/core';
import { MenuAccessService } from '../menu-access.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'jhi-menu-access-edit',
  templateUrl: './menu-access-edit.component.html',
})
// const ELEMENT_DATA: PeriodicElement[] = [
//   { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
//   { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
//   { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
//   { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
//   { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
//   { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
//   { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
//   { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
//   { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
//   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
// ];

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }
export class MenuAccessEditComponent implements OnInit {
  id;
  data;
  constructor(private menuAccessService: MenuAccessService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(res => (this.id = res['id']));
  }

  ngOnInit(): void {
    this.menuAccessService
      .getMenuAccess({ idAppMenu: this.id })
      .pipe(map(data => data.body.filter(filtered => filtered.id === this.id)))
      .subscribe(res => (this.data = res[0]));
  }

  displayedColumns: string[] = ['no', 'position'];
  // dataSource = ELEMENT_DATA;
  dataSource$: Observable<Array<any>>;

  // get position() {
  //   return this.item;
  // }

  // set position(position: IEmployee) {
  //   this.item = employee;
  // }
}
