import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthVerifyCodeComponent } from './auth-verify-code.component';

describe('AuthVerifyCodeComponent', () => {
  let component: AuthVerifyCodeComponent;
  let fixture: ComponentFixture<AuthVerifyCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthVerifyCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthVerifyCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
