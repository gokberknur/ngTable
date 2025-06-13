import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomComponentComponent } from './random-component.component';

describe('RandomComponentComponent', () => {
  let component: RandomComponentComponent;
  let fixture: ComponentFixture<RandomComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
