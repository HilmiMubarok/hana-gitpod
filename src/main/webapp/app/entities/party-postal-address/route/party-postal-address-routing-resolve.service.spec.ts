import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPartyPostalAddress, PartyPostalAddress } from '../party-postal-address.model';
import { PartyPostalAddressService } from '../service/party-postal-address.service';

import { PartyPostalAddressRoutingResolveService } from './party-postal-address-routing-resolve.service';

describe('PartyPostalAddress routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PartyPostalAddressRoutingResolveService;
  let service: PartyPostalAddressService;
  let resultPartyPostalAddress: IPartyPostalAddress | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(PartyPostalAddressRoutingResolveService);
    service = TestBed.inject(PartyPostalAddressService);
    resultPartyPostalAddress = undefined;
  });

  describe('resolve', () => {
    it('should return IPartyPostalAddress returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPartyPostalAddress = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPartyPostalAddress).toEqual({ id: 123 });
    });

    it('should return new IPartyPostalAddress if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPartyPostalAddress = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPartyPostalAddress).toEqual(new PartyPostalAddress());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PartyPostalAddress })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPartyPostalAddress = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPartyPostalAddress).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
