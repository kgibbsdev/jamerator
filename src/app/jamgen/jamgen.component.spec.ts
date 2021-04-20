import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JamgenComponent } from './jamgen.component';

describe('JamgenComponent', () => {
  let component: JamgenComponent;
  let fixture: ComponentFixture<JamgenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JamgenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JamgenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
