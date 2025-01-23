import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { EstatisticaDetailComponent } from './estatistica-detail.component';

describe('Estatistica Management Detail Component', () => {
  let comp: EstatisticaDetailComponent;
  let fixture: ComponentFixture<EstatisticaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstatisticaDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./estatistica-detail.component').then(m => m.EstatisticaDetailComponent),
              resolve: { estatistica: () => of({ id: 7748 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EstatisticaDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstatisticaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load estatistica on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EstatisticaDetailComponent);

      // THEN
      expect(instance.estatistica()).toEqual(expect.objectContaining({ id: 7748 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
