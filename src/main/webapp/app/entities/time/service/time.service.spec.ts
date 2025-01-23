import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITime } from '../time.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../time.test-samples';

import { TimeService } from './time.service';

const requireRestSample: ITime = {
  ...sampleWithRequiredData,
};

describe('Time Service', () => {
  let service: TimeService;
  let httpMock: HttpTestingController;
  let expectedResult: ITime | ITime[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TimeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Time', () => {
      const time = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(time).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Time', () => {
      const time = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(time).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Time', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Time', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Time', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTimeToCollectionIfMissing', () => {
      it('should add a Time to an empty array', () => {
        const time: ITime = sampleWithRequiredData;
        expectedResult = service.addTimeToCollectionIfMissing([], time);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(time);
      });

      it('should not add a Time to an array that contains it', () => {
        const time: ITime = sampleWithRequiredData;
        const timeCollection: ITime[] = [
          {
            ...time,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTimeToCollectionIfMissing(timeCollection, time);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Time to an array that doesn't contain it", () => {
        const time: ITime = sampleWithRequiredData;
        const timeCollection: ITime[] = [sampleWithPartialData];
        expectedResult = service.addTimeToCollectionIfMissing(timeCollection, time);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(time);
      });

      it('should add only unique Time to an array', () => {
        const timeArray: ITime[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const timeCollection: ITime[] = [sampleWithRequiredData];
        expectedResult = service.addTimeToCollectionIfMissing(timeCollection, ...timeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const time: ITime = sampleWithRequiredData;
        const time2: ITime = sampleWithPartialData;
        expectedResult = service.addTimeToCollectionIfMissing([], time, time2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(time);
        expect(expectedResult).toContain(time2);
      });

      it('should accept null and undefined values', () => {
        const time: ITime = sampleWithRequiredData;
        expectedResult = service.addTimeToCollectionIfMissing([], null, time, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(time);
      });

      it('should return initial array if no Time is added', () => {
        const timeCollection: ITime[] = [sampleWithRequiredData];
        expectedResult = service.addTimeToCollectionIfMissing(timeCollection, undefined, null);
        expect(expectedResult).toEqual(timeCollection);
      });
    });

    describe('compareTime', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTime(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 9921 };
        const entity2 = null;

        const compareResult1 = service.compareTime(entity1, entity2);
        const compareResult2 = service.compareTime(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 9921 };
        const entity2 = { id: 14578 };

        const compareResult1 = service.compareTime(entity1, entity2);
        const compareResult2 = service.compareTime(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 9921 };
        const entity2 = { id: 9921 };

        const compareResult1 = service.compareTime(entity1, entity2);
        const compareResult2 = service.compareTime(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
