import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'frontend';
  products: any[] = [];

  constructor(private http: HttpClient) {}

  loadProducts() {
    const query = `{ products { nodes { id name price } } }`;
    this.http.post<any>('http://localhost:5000/graphql', { query })
      .subscribe(res => this.products = res.data.products.nodes);
  }
}
