import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductService } from '../service/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../dto/product.dto';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  todayDate: string = new Date().toISOString().split('T')[0];
  isEditMode = false; 
  productId: string | null = null;

  registroForm = new FormGroup({
    id: new FormControl( '', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
    logo: new FormControl('', [Validators.required]),
    fechaLiberacion: new FormControl('', [Validators.required])
  });

  isSubmitted = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id'] != null || params['id'] != undefined) {
        this.isEditMode = true;
        this.registroForm.get('id')?.disable();
        this.productId = params['id'];
        this.registroForm.patchValue({
          id: params['id'],
          nombre: params['name'],
          descripcion: params['description'],
          logo: params['logo'],
          fechaLiberacion: params['releaseDate']
        });
      }
    });
  }

  get id() {
    return this.registroForm.get('id');
  }

  get nombre() {
    return this.registroForm.get('nombre');
  }

  get descripcion() {
    return this.registroForm.get('descripcion');
  }

  get logo() {
    return this.registroForm.get('logo');
  }

  get fechaLiberacion() {
    return this.registroForm.get('fechaLiberacion');
  }

  dateValidator(control: FormControl) {
    const today = new Date().toISOString().split('T')[0];
    return control.value >= today ? null : { invalidDate: true };
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.registroForm.invalid) {
      return;
    }

    const releaseDate = new Date(this.fechaLiberacion?.value || '');
    const reviewDate = new Date(releaseDate);
    reviewDate.setFullYear(releaseDate.getFullYear() + 1);

    const product: Product = new Product(
      this.id?.value || '',
      this.nombre?.value || '',
      this.descripcion?.value || '',
      this.logo?.value || '',
      releaseDate.toISOString(),
      reviewDate.toISOString()
    );

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, product).subscribe(
        response => {
          Swal.fire(
            'Actualizado!',
            `El producto ${product.name} ha sido actualizado exitosamente.`,
            'success'
          ).then(() => {
            this.isEditMode = false;
            this.router.navigate(['/productos']);
          });
        },
        error => {
          console.error('Error updating product', error);
          Swal.fire(
            'Error!',
            'Hubo un problema al actualizar el producto.',
            'error'
          );
        }
      );
    } else {
      this.productService.addProduct(product).subscribe(
        response => {
          Swal.fire(
            'Creado!',
            `El producto ${product.name} ha sido creado exitosamente.`,
            'success'
          ).then(() => {
            this.registroForm.reset(); 
            this.isSubmitted = false; 
            this.router.navigate(['/productos']);
          });
        },
        error => {
          console.error('Error adding product', error);
          Swal.fire(
            'Error!',
            'Hubo un problema al crear el producto.',
            'error'
          );
        }
      );
    }
  }
}
