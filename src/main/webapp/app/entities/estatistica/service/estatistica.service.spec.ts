import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IEstatistica } from '../estatistica.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../estatistica.test-samples';

import { EstatisticaService } from './estatistica.service';

const requireRestSample: IEstatistica = {
  ...sampleWithRequiredData,
};

describe('Estatistica Service', () => {
  let service: EstatisticaService;
  let httpMock: HttpTestingController;
  let expectedResult: IEstatistica | IEstatistica[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EstatisticaService);
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

    it('should create a Estatistica', () => {
      const estatistica = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(estatistica).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Estatistica', () => {
      const estatistica = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(estatistica).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Estatistica', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Estatistica', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Estatistica', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEstatisticaToCollectionIfMissing', () => {
      it('should add a Estatistica to an empty array', () => {
        const estatistica: IEstatistica = sampleWithRequiredData;
        expectedResult = service.addEstatisticaToCollectionIfMissing([], estatistica);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estatistica);
      });

      it('should not add a Estatistica to an array that contains it', () => {
        const estatistica: IEstatistica = sampleWithRequiredData;
        const estatisticaCollection: IEstatistica[] = [
          {
            ...estatistica,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEstatisticaToCollectionIfMissing(estatisticaCollection, estatistica);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Estatistica to an array that doesn't contain it", () => {
        const estatistica: IEstatistica = sampleWithRequiredData;
        const estatisticaCollection: IEstatistica[] = [sampleWithPartialData];
        expectedResult = service.addEstatisticaToCollectionIfMissing(estatisticaCollection, estatistica);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estatistica);
      });

      it('should add only unique Estatistica to an array', () => {
        const estatisticaArray: IEstatistica[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const estatisticaCollection: IEstatistica[] = [sampleWithRequiredData];
        expectedResult = service.addEstatisticaToCollectionIfMissing(estatisticaCollection, ...estatisticaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const estatistica: IEstatistica = sampleWithRequiredData;
        const estatistica2: IEstatistica = sampleWithPartialData;
        expectedResult = service.addEstatisticaToCollectionIfMissing([], estatistica, estatistica2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estatistica);
        expect(expectedResult).toContain(estatistica2);
      });

      it('should accept null and undefined values', () => {
        const estatistica: IEstatistica = sampleWithRequiredData;
        expectedResult = service.addEstatisticaToCollectionIfMissing([], null, estatistica, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estatistica);
      });

      it('should return initial array if no Estatistica is added', () => {
        const estatisticaCollection: IEstatistica[] = [sampleWithRequiredData];
        expectedResult = service.addEstatisticaToCollectionIfMissing(estatisticaCollection, undefined, null);
        expect(expectedResult).toEqual(estatisticaCollection);
      });
    });

    describe('compareEstatistica', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEstatistica(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 7748 };
        const entity2 = null;

        const compareResult1 = service.compareEstatistica(entity1, entity2);
        const compareResult2 = service.compareEstatistica(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 7748 };
        const entity2 = { id: 1903 };

        const compareResult1 = service.compareEstatistica(entity1, entity2);
        const compareResult2 = service.compareEstatistica(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 7748 };
        const entity2 = { id: 7748 };

        const compareResult1 = service.compareEstatistica(entity1, entity2);
        const compareResult2 = service.compareEstatistica(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
