import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCustomSelectEditorComponent } from './my-custom-select-editor.component';

describe('MyCustomSelectEditorComponent', () => {
  let component: MyCustomSelectEditorComponent;
  let fixture: ComponentFixture<MyCustomSelectEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCustomSelectEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCustomSelectEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
