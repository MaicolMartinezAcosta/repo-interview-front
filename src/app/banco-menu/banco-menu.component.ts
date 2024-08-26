import { Router } from '@angular/router';
import { ProductService } from './../service/product.service';
import { Product } from './../dto/product.dto';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-banco-menu',
  templateUrl: './banco-menu.component.html',
  styleUrls: ['./banco-menu.component.css']
})
export class BancoMenuComponent implements OnInit, AfterViewInit {
  constructor(private productService: ProductService, private router: Router){
  }

  displayedColumns: string[] = ['logo', 'name', 'description', 'releaseDate', 'restructureDate'];
  dataSource = new MatTableDataSource<ProductTable>();
  pageSizes: number[] = [5, 10, 15];
  pageSize = 10; 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getProducts();
  }

  async getProducts() {
    this.productService.getProducts().subscribe(
      (response) => {
        this.dataSource.data = response.data.map((product: Product) => ({
          id: product.id,
          logo: product.logo,
          name: product.name,
          description: product.description,
          releaseDate: new Date(product.date_release).toISOString().substring(0, 10),
          restructureDate: new Date(product.date_revision).toISOString().substring(0, 10)
        }));
      },
      error => console.error('Error retrieving products', error)
    );
  }
  
  onRowClick(product: ProductTable): void {
    Swal.fire({
      title: '¿Qué acción desea realizar?',
      text: `Producto: ${product.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Actualizar el producto:', product);
        this.router.navigate(['/createProduct'], {
          queryParams: {
            id: product.id,
            name: product.name,
            description: product.description,
            logo: product.logo,
            releaseDate: product.releaseDate,
            restructureDate: product.restructureDate
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: '¿Está seguro?',
          text: `¿Quiere eliminar el producto: ${product.name}?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        }).then((confirmResult) => {
          if (confirmResult.isConfirmed) {
            this.productService.DeleteProduct(product.id).subscribe(
              () => {
                Swal.fire(
                  'Eliminado!',
                  `El producto ${product.name} ha sido eliminado.`,
                  'success'
                );
                this.getProducts();
              },
              error => {
                Swal.fire(
                  'Error!',
                  'Hubo un problema al eliminar el producto.',
                  'error'
                );
                console.error('Error al eliminar el producto', error);
              }
            );
          }
        });
      }
    });
  }
  
  
  changeCursor() {
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.pageSize = this.pageSize; 
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = event.value;
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
      this.paginator.pageIndex = 0; 
    }
  }
}

export interface ProductTable {
  id: string;
  logo: string;
  name: string;
  description: string;
  releaseDate: string;
  restructureDate: string;
}

// Datos de prueba
