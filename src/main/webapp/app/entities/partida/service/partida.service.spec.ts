import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPartida } from '../partida.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../partida.test-samples';

import { PartidaService, RestPartida } from './partida.service';

const requireRestSample: RestPartida = {
  ...sampleWithRequiredData,
  data: sampleWithRequiredData.data?.format(DATE_FORMAT),
};

describe('Partida Service', () => {
  let service: PartidaService;
  let httpMock: HttpTestingController;
  let expectedResult: IPartida | IPartida[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PartidaService);
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

    it('should create a Partida', () => {
      const partida = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(partida).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Partida', () => {
      const partida = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(partida).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Partida', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Partida', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Partida', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPartidaToCollectionIfMissing', () => {
      it('should add a Partida to an empty array', () => {
        const partida: IPartida = sampleWithRequiredData;
        expectedResult = service.addPartidaToCollectionIfMissing([], partida);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(partida);
      });

      it('should not add a Partida to an array that contains it', () => {
        const partida: IPartida = sampleWithRequiredData;
        const partidaCollection: IPartida[] = [
          {
            ...partida,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPartidaToCollectionIfMissing(partidaCollection, partida);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Partida to an array that doesn't contain it", () => {
        const partida: IPartida = sampleWithRequiredData;
        const partidaCollection: IPartida[] = [sampleWithPartialData];
        expectedResult = service.addPartidaToCollectionIfMissing(partidaCollection, partida);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(partida);
      });

      it('should add only unique Partida to an array', () => {
        const partidaArray: IPartida[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const partidaCollection: IPartida[] = [sampleWithRequiredData];
        expectedResult = service.addPartidaToCollectionIfMissing(partidaCollection, ...partidaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const partida: IPartida = sampleWithRequiredData;
        const partida2: IPartida = sampleWithPartialData;
        expectedResult = service.addPartidaToCollectionIfMissing([], partida, partida2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(partida);
        expect(expectedResult).toContain(partida2);
      });

      it('should accept null and undefined values', () => {
        const partida: IPartida = sampleWithRequiredData;
        expectedResult = service.addPartidaToCollectionIfMissing([], null, partida, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(partida);
      });

      it('should return initial array if no Partida is added', () => {
        const partidaCollection: IPartida[] = [sampleWithRequiredData];
        expectedResult = service.addPartidaToCollectionIfMissing(partidaCollection, undefined, null);
        expect(expectedResult).toEqual(partidaCollection);
      });
    });

    describe('comparePartida', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePartida(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 21967 };
        const entity2 = null;

        const compareResult1 = service.comparePartida(entity1, entity2);
        const compareResult2 = service.comparePartida(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 21967 };
        const entity2 = { id: 17449 };

        const compareResult1 = service.comparePartida(entity1, entity2);
        const compareResult2 = service.comparePartida(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 21967 };
        const entity2 = { id: 21967 };

        const compareResult1 = service.comparePartida(entity1, entity2);
        const compareResult2 = service.comparePartida(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
