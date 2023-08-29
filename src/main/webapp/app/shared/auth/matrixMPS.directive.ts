import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

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

  @Input()
  set jhiMatrixDirMPS(value: string) {
    this.elementType = value;
  }

  @Input() jhiMatrixDirMPSPermission: any;

  constructor(private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) {}

  private matrixInput(): void {	
	if (this.jhiMatrixDirMPSPermission.length > 0) {
	  if (this.jhiMatrixDirMPSPermission[0].permission === 'EDIT') {
		this.viewContainerRef.createEmbeddedView(this.templateRef);
	  }
	}
  }

  private matrixLabel(): void {
	if (this.jhiMatrixDirMPSPermission.length > 0) {
	  if (this.jhiMatrixDirMPSPermission[0].permission === 'VIEW') {
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
	if (this.jhiMatrixDirMPSPermission.length === 0) {
	  if (this.elementType !== 'input') {
		this.viewContainerRef.createEmbeddedView(this.templateRef);
	  }
	} else {
	  this.checkAccess();
	}
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
