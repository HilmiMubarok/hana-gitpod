import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { PositionService } from 'app/entities/position/position.service';
import { TemplateService } from 'app/layouts/template/template.service';

import lodash from 'lodash';

@Directive({
  selector: '[jhiMatrixDirIDD]',
})
export class MatrixIDDDirective implements OnInit, OnDestroy {
  private authorities!: string[];
  private elementType!: string;
  private readonly destroy$ = new Subject<void>();
  private positionTypeId: string;

  @Input()
  set jhiMatrixDirIDD(value: string) {
    this.elementType = value;
  }

  constructor(private accountService: AccountService, private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef, private positionService: PositionService, private templateService: TemplateService) {}

  private matrixInput(): void {
	if (this.positionTypeId) {
	  if (this.positionTypeId === 'RM') {
		this.viewContainerRef.createEmbeddedView(this.templateRef);
	  }
	}
    /* if (lodash.indexOf(this.authorities, 'ROLE_RM') >= 0) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } */
  }

  private matrixLabel(): void {
	if (this.positionTypeId) {
	  if (this.positionTypeId === 'RM') {
		// do nothing
	  } else {
		this.viewContainerRef.createEmbeddedView(this.templateRef);
	  }
	}
    /* if (lodash.indexOf(this.authorities, 'ROLE_RM') >= 0) {
      // do nothing
    } else {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } */
  }

  private checkAccess(): void {
    if (this.elementType === 'input') {
      this.matrixInput();
    } else {
      this.matrixLabel();
    }
  }
  
  /* private getLocStor(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  } */
  
  /* private getPositionTypeId(): void {
	this.positionService.find(this.getLocStor('POS')).subscribe(res => {
	  this.positionTypeId = res.body.positionTypeId;
	  this.checkAccess();
	});
  } */

  ngOnInit() {
    this.viewContainerRef.clear();
	this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: string) => {
      this.positionTypeId = newPos;
	  this.checkAccess();
    });
	// this.getPositionTypeId();

    /* this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))

      .subscribe(res => {
        this.authorities = res.authorities;
        this.checkAccess();
      }); */
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
