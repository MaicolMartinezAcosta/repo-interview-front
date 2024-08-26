import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { AddProductComponent } from './add-product.component';
import { ProductService } from '../service/product.service';
import { Product } from '../dto/product.dto';
import 'jest-preset-angular/setup-jest';

jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({}),
}));

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let productService: ProductService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    const productServiceMock = {
      addProduct: jest.fn(),
      updateProduct: jest.fn(),
    };

    const routerMock = {
      navigate: jest.fn(),
    };

    const activatedRouteMock = {
      queryParams: of({
        id: null,
        name: '',
        description: '',
        logo: '',
        releaseDate: ''
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AddProductComponent],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form for add mode', () => {
    fixture.detectChanges();
    expect(component.registroForm).toBeDefined();
    expect(component.isEditMode).toBe(false);
    expect(component.productId).toBe(null);
  });

  it('should initialize form for edit mode', () => {
    activatedRoute.queryParams = of({
      id: '123',
      name: 'Product Name',
      description: 'Product Description',
      logo: 'Product Logo',
      releaseDate: '2024-08-25'
    });
    fixture.detectChanges();
    expect(component.isEditMode).toBe(true);
    expect(component.productId).toBe('123');
    expect(component.registroForm.get('id')?.value).toBe('123');
    expect(component.registroForm.get('nombre')?.value).toBe('Product Name');
  });

  it('should validate release date', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(component.dateValidator(new FormControl(today))).toBeNull();
    expect(component.dateValidator(new FormControl('2023-01-01'))).toEqual({ invalidDate: true });
  });

  it('should call addProduct and navigate on successful add', () => {
    const product: Product = new Product(
      '123',
      'Product Name',
      'Product Description',
      'Product Logo',
      '2024-08-25',
      '2025-08-25'
    );

    productService.addProduct = jest.fn().mockReturnValue(of({}));
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.registroForm.setValue({
      id: '123',
      nombre: 'Product Name',
      descripcion: 'Product Description',
      logo: 'Product Logo',
      fechaLiberacion: '2024-08-25'
    });

    component.onSubmit();

    expect(productService.addProduct).toHaveBeenCalledWith(product);
    expect(navigateSpy).toHaveBeenCalledWith(['/productos']);
    expect(Swal.fire).toHaveBeenCalledWith('Creado!', `El producto ${product.name} ha sido creado exitosamente.`, 'success');
  });

  it('should call updateProduct and navigate on successful update', () => {
    component.isEditMode = true;
    component.productId = '123';

    const product: Product = new Product(
      '123',
      'Product Name',
      'Product Description',
      'Product Logo',
      '2024-08-25',
      '2025-08-25'
    );

    productService.updateProduct = jest.fn().mockReturnValue(of({}));
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.registroForm.setValue({
      id: '123',
      nombre: 'Product Name',
      descripcion: 'Product Description',
      logo: 'Product Logo',
      fechaLiberacion: '2024-08-25'
    });

    component.onSubmit();

    expect(productService.updateProduct).toHaveBeenCalledWith('123', product);
    expect(navigateSpy).toHaveBeenCalledWith(['/productos']);
    expect(Swal.fire).toHaveBeenCalledWith('Actualizado!', `El producto ${product.name} ha sido actualizado exitosamente.`, 'success');
  });

  it('should handle errors during add', () => {
    const product: Product = new Product(
      '123',
      'Product Name',
      'Product Description',
      'Product Logo',
      '2024-08-25',
      '2025-08-25'
    );

    productService.addProduct = jest.fn().mockReturnValue(throwError(() => new Error('Error')));
    component.registroForm.setValue({
      id: '123',
      nombre: 'Product Name',
      descripcion: 'Product Description',
      logo: 'Product Logo',
      fechaLiberacion: '2024-08-25'
    });

    component.onSubmit();

    expect(Swal.fire).toHaveBeenCalledWith('Error!', 'Hubo un problema al crear el producto.', 'error');
  });

  it('should handle errors during update', () => {
    component.isEditMode = true;
    component.productId = '123';

    const product: Product = new Product(
      '123',
      'Product Name',
      'Product Description',
      'Product Logo',
      '2024-08-25',
      '2025-08-25'
    );

    productService.updateProduct = jest.fn().mockReturnValue(throwError(() => new Error('Error')));
    component.registroForm.setValue({
      id: '123',
      nombre: 'Product Name',
      descripcion: 'Product Description',
      logo: 'Product Logo',
      fechaLiberacion: '2024-08-25'
    });

    component.onSubmit();

    expect(Swal.fire).toHaveBeenCalledWith('Error!', 'Hubo un problema al actualizar el producto.', 'error');
  });
});
