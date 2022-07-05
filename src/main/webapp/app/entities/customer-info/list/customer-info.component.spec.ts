import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CustomerInfoService } from '../service/customer-info.service';

import { CustomerInfoComponent } from './customer-info.component';

describe('CustomerInfo Management Component', () => {
  let comp: CustomerInfoComponent;
  let fixture: ComponentFixture<CustomerInfoComponent>;
  let service: CustomerInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'customer-info', component: CustomerInfoComponent }]), HttpClientTestingModule],
      declarations: [CustomerInfoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
      ],
    })
      .overrideTemplate(CustomerInfoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CustomerInfoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CustomerInfoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.customerInfos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
