import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { TemplateService } from 'app/layouts/template/template.service';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { createRequestOption } from 'app/core/request/request-util';

import lodash from 'lodash';

@Directive({
  selector: '[jhiMatrixDirMPS]',
})
export class MatrixMenuPosStatDirective implements OnInit, OnDestroy {
  private elementType!: string;
  private menu!: string;
  private status!: string;
  private position: any;
  private permission = [];
  private readonly destroy$ = new Subject<void>();
  private resourceUrlPermission = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/app-menu-permission');

  @Input()
  set jhiMatrixDirMPS(value: string) {
    this.elementType = value;
  }

  @Input() jhiMatrixDirMPSMenu: string;
  @Input() jhiMatrixDirMPSStatus: string;

  constructor(private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef, private templateService: TemplateService, protected applicationConfigService: ApplicationConfigService, protected http?: HttpClient) {}
  
  private convertDateArrayFromServer(res: HttpResponse<any[]>): HttpResponse<any[]> {
    return res;
  }

  private itemPreLoad(item: any): any {
    return item;
  }

  private preLoadItemArray(res: HttpResponse<any[]>): HttpResponse<any[]> {
    res.body.forEach(item => {
      this.itemPreLoad(item);
    });
    return res;
  }
  
  private queryFilterBy(req?: any): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(this.resourceUrlPermission + '/filterBy', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any[]>) => this.preLoadItemArray(res)));
  }

  private matrixInput(): void {	
	if (this.permission.length > 0) {
	  if (this.permission[0].permission === 'EDIT') {
		this.viewContainerRef.createEmbeddedView(this.templateRef);
	  }
	}
  }

  private matrixLabel(): void {
	if (this.permission.length > 0) {
	  if (this.permission[0].permission === 'VIEW') {
		this.viewContainerRef.createEmbeddedView(this.templateRef);
	  }
	}
  }

  private checkAccess(): void {
    if (this.elementType === 'input') {
      this.matrixInput();
    } else {
      this.matrixLabel();
    }
  }

  ngOnInit() {
    this.viewContainerRef.clear();
	this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: any) => {
	  this.position = newPos;
	  this.queryFilterBy({menuItemId: this.jhiMatrixDirMPSMenu, positionTypeId: this.position.positionTypeId, statusId: this.jhiMatrixDirMPSStatus}).subscribe(permissionObject => {
		this.permission = permissionObject.body;
		this.checkAccess();
	  });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
