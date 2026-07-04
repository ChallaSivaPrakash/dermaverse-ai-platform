import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Order } from '../../services/api.service';

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  orders: Order[] = [];
  cart: CartItem[] = [];
  loading = true;
  error = '';
  checkoutLoading = false;
  checkoutSuccess = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadCart();
    this.api.getMyOrders().subscribe({
      next: (data) => { this.orders = data; this.loading = false; },
      error: () => { this.error = 'Failed to load orders.'; this.loading = false; }
    });
  }

  loadCart() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
  }

  get cartTotal(): number {
    return this.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  removeFromCart(productId: string) {
    this.cart = this.cart.filter(i => i.product_id !== productId);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    window.dispatchEvent(new Event('storage'));
  }

  checkout() {
    if (this.cart.length === 0) return;
    this.checkoutLoading = true;
    this.api.createOrder(this.cart, this.cartTotal).subscribe({
      next: (order) => {
        this.orders.unshift(order);
        this.cart = [];
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('storage'));
        this.checkoutSuccess = 'Order placed successfully!';
        this.checkoutLoading = false;
        setTimeout(() => this.checkoutSuccess = '', 3000);
      },
      error: () => {
        this.error = 'Checkout failed.';
        this.checkoutLoading = false;
      }
    });
  }
}
