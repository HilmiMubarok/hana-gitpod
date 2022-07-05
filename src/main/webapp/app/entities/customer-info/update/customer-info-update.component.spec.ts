import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CustomerInfoService } from '../service/customer-info.service';
import { ICustomerInfo, CustomerInfo } from '../customer-info.model';

import { CustomerInfoUpdateComponent } from './customer-info-update.component';

describe('CustomerInfo Management Update Component', () => {
  let comp: CustomerInfoUpdateComponent;
  let fixture: ComponentFixture<CustomerInfoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let customerInfoService: CustomerInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CustomerInfoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CustomerInfoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CustomerInfoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    customerInfoService = TestBed.inject(CustomerInfoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const customerInfo: ICustomerInfo = { id: 456 };

      activatedRoute.data = of({ customerInfo });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(customerInfo));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CustomerInfo>>();
      const customerInfo = { id: 123 };
      jest.spyOn(customerInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customerInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customerInfo }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(customerInfoService.update).toHaveBeenCalledWith(customerInfo);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CustomerInfo>>();
      const customerInfo = new CustomerInfo();
      jest.spyOn(customerInfoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customerInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customerInfo }));
      saveSubject.complete();

      // THEN
      expect(customerInfoService.create).toHaveBeenCalledWith(customerInfo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CustomerInfo>>();
      const customerInfo = { id: 123 };
      jest.spyOn(customerInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customerInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(customerInfoService.update).toHaveBeenCalledWith(customerInfo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
