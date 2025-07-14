import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedealComponent } from './createdeal.component';

describe('CreatedealComponent', () => {
  let component: CreatedealComponent;
  let fixture: ComponentFixture<CreatedealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedealComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
