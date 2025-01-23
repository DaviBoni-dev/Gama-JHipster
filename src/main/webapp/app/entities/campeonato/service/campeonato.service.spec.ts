import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ICampeonato } from '../campeonato.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../campeonato.test-samples';

import { CampeonatoService, RestCampeonato } from './campeonato.service';

const requireRestSample: RestCampeonato = {
  ...sampleWithRequiredData,
  dataInicio: sampleWithRequiredData.dataInicio?.format(DATE_FORMAT),
  dataFim: sampleWithRequiredData.dataFim?.format(DATE_FORMAT),
};

describe('Campeonato Service', () => {
  let service: CampeonatoService;
  let httpMock: HttpTestingController;
  let expectedResult: ICampeonato | ICampeonato[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(CampeonatoService);
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

    it('should create a Campeonato', () => {
      const campeonato = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(campeonato).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Campeonato', () => {
      const campeonato = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(campeonato).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Campeonato', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Campeonato', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Campeonato', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCampeonatoToCollectionIfMissing', () => {
      it('should add a Campeonato to an empty array', () => {
        const campeonato: ICampeonato = sampleWithRequiredData;
        expectedResult = service.addCampeonatoToCollectionIfMissing([], campeonato);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(campeonato);
      });

      it('should not add a Campeonato to an array that contains it', () => {
        const campeonato: ICampeonato = sampleWithRequiredData;
        const campeonatoCollection: ICampeonato[] = [
          {
            ...campeonato,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCampeonatoToCollectionIfMissing(campeonatoCollection, campeonato);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Campeonato to an array that doesn't contain it", () => {
        const campeonato: ICampeonato = sampleWithRequiredData;
        const campeonatoCollection: ICampeonato[] = [sampleWithPartialData];
        expectedResult = service.addCampeonatoToCollectionIfMissing(campeonatoCollection, campeonato);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(campeonato);
      });

      it('should add only unique Campeonato to an array', () => {
        const campeonatoArray: ICampeonato[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const campeonatoCollection: ICampeonato[] = [sampleWithRequiredData];
        expectedResult = service.addCampeonatoToCollectionIfMissing(campeonatoCollection, ...campeonatoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const campeonato: ICampeonato = sampleWithRequiredData;
        const campeonato2: ICampeonato = sampleWithPartialData;
        expectedResult = service.addCampeonatoToCollectionIfMissing([], campeonato, campeonato2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(campeonato);
        expect(expectedResult).toContain(campeonato2);
      });

      it('should accept null and undefined values', () => {
        const campeonato: ICampeonato = sampleWithRequiredData;
        expectedResult = service.addCampeonatoToCollectionIfMissing([], null, campeonato, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(campeonato);
      });

      it('should return initial array if no Campeonato is added', () => {
        const campeonatoCollection: ICampeonato[] = [sampleWithRequiredData];
        expectedResult = service.addCampeonatoToCollectionIfMissing(campeonatoCollection, undefined, null);
        expect(expectedResult).toEqual(campeonatoCollection);
      });
    });

    describe('compareCampeonato', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCampeonato(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 4328 };
        const entity2 = null;

        const compareResult1 = service.compareCampeonato(entity1, entity2);
        const compareResult2 = service.compareCampeonato(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 4328 };
        const entity2 = { id: 19911 };

        const compareResult1 = service.compareCampeonato(entity1, entity2);
        const compareResult2 = service.compareCampeonato(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 4328 };
        const entity2 = { id: 4328 };

        const compareResult1 = service.compareCampeonato(entity1, entity2);
        const compareResult2 = service.compareCampeonato(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
