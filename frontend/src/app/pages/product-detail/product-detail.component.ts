import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, Product } from '../../services/api.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error = '';
  addedToCart = false;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getProduct(id).subscribe({
      next: (p) => { this.product = p; this.loading = false; },
      error: () => { this.error = 'Product not found.'; this.loading = false; }
    });
  }

  addToCart() {
    if (!this.product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((i: { product_id: string }) => i.product_id === this.product!.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        product_id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        quantity: 1
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    this.addedToCart = true;
    setTimeout(() => this.addedToCart = false, 2000);
  }
}
