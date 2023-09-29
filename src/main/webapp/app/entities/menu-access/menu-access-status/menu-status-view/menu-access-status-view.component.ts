import { Component, OnInit } from '@angular/core';
import { MenuAccessStatusService } from '../menu-access-status.service';
import { Observable, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-menu-access-veiw-status',
  templateUrl: './menu-access-status-view.component.html',
  styleUrls: ['../../menu-access.style.css'],
})
export class MenuAccessStatusVeiwComponent implements OnInit {
  data;
  id;

  constructor(private menuAccessStatusService: MenuAccessStatusService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(res => (this.id = res['id']));
  }
  ngOnInit(): void {
    this.menuAccessStatusService
      .getAccessStatus({ idappMenu: this.id })
      .pipe(map(data => data.body.filter(filtered => filtered.id === this.id)))
      .subscribe(res => (this.data = res[0]));
  }

  displayedColumns: string[] = ['no', 'status', 'description'];
  dataSource$: Observable<Array<any>>;

  public previousState(): void {
    window.history.back();
  }
}
