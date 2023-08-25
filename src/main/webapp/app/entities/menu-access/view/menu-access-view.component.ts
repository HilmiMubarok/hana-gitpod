import { Component, OnInit } from '@angular/core';
import { MenuAccessService } from '../menu-access.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'jhi-menu-access-view',
  templateUrl: './menu-access-view.component.html',
})
export class MenuAccessViewComponent implements OnInit {
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

  dataSource$: Observable<Array<any>>;
}
