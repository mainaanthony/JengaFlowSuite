import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  stock: number;
}

interface Product {
  id?: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  sku: string;
  barcode: string;
  tags: string[];
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  minimumStock: number;
  storageLocation: string;
  supplier: string;
  weight: number;
  dimensions: { length: number; width: number; height: number };
  taxable: boolean;
  trackInventory: boolean;
  allowBackorders: boolean;
  requiresSerialNumber: boolean;
  hasExpiryDate: boolean;
  hasVariants: boolean;
  variants: ProductVariant[];
  isDraft?: boolean;
}

@Component({
  selector: 'app-add-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.scss']
})
export class AddProductModalComponent implements OnInit {
  currentTab: 'basicInfo' | 'pricing' | 'details' | 'variants' = 'basicInfo';

  // Form data
  productForm: FormGroup;

  // Tab data
  categories = ['Electronics', 'Building Materials', 'Furniture', 'Hardware', 'Plumbing', 'Paint & Chemicals'];
  brands = ['Samsung', 'LG', 'Sony', 'Generic Brand', 'Premium Brand', 'Budget Brand'];
  storageLocations = ['Warehouse A', 'Warehouse B', 'Store Shelf', 'Back Room', 'Cold Storage'];
  suppliers = ['Supplier A', 'Supplier B', 'Supplier C', 'Local Distributor', 'International Supplier'];

  // Product images
  productImages: File[] = [];
  imagePreviewUrls: string[] = [];

  // Variants
  variants: ProductVariant[] = [];
  hasVariants = false;
  newVariant: ProductVariant = {
    id: '',
    size: '',
    color: '',
    sku: '',
    price: 0,
    stock: 0
  };

  // Generated values
  generatedSKU = '';
  generatedBarcode = '';

  // Tag management
  currentTag = '';
  tags: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      category: ['', Validators.required],
      brand: [''],
      sku: ['', Validators.required],
      barcode: [''],
      costPrice: [0, [Validators.required, Validators.min(0)]],
      sellingPrice: [0, [Validators.required, Validators.min(0)]],
      currentStock: [0, [Validators.required, Validators.min(0)]],
      minimumStock: [0, Validators.min(0)],
      storageLocation: [''],
      supplier: [''],
      weight: [0, Validators.min(0)],
      dimensionLength: [0, Validators.min(0)],
      dimensionWidth: [0, Validators.min(0)],
      dimensionHeight: [0, Validators.min(0)],
      taxable: [true],
      trackInventory: [true],
      allowBackorders: [false],
      requiresSerialNumber: [false],
      hasExpiryDate: [false]
    });
  }

  ngOnInit(): void {
    this.initializeFormData();
  }

  initializeFormData(): void {
    if (this.data && this.data.product) {
      this.productForm.patchValue(this.data.product);
    }
    this.generateSKU();
  }

  // ============ TAB NAVIGATION ============
  selectTab(tab: 'basicInfo' | 'pricing' | 'details' | 'variants'): void {
    this.currentTab = tab;
  }

  isTabValid(tab: string): boolean {
    if (tab === 'basicInfo') {
      const nameValid = this.productForm.get('name')?.valid ?? false;
      const categoryValid = this.productForm.get('category')?.valid ?? false;
      return nameValid && categoryValid;
    }
    if (tab === 'pricing') {
      const costPriceValid = this.productForm.get('costPrice')?.valid ?? false;
      const sellingPriceValid = this.productForm.get('sellingPrice')?.valid ?? false;
      return costPriceValid && sellingPriceValid;
    }
    return true;
  }

  getTabClass(tab: string): string {
    if (this.currentTab === tab) return 'active';
    if (this.isTabValid(tab)) return 'completed';
    return '';
  }

  // ============ BASIC INFO TAB ============
  generateSKU(): void {
    const name = this.productForm.get('name')?.value || 'PROD';
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.generatedSKU = `${name.substring(0, 3).toUpperCase()}-${timestamp}-${random}`;
    this.productForm.patchValue({ sku: this.generatedSKU });
  }

  generateBarcode(): void {
    const random = Math.random().toString().substring(2, 14);
    this.generatedBarcode = random;
    this.productForm.patchValue({ barcode: this.generatedBarcode });
  }

  addTag(): void {
    if (this.currentTag.trim() && !this.tags.includes(this.currentTag.trim())) {
      this.tags.push(this.currentTag.trim());
      this.currentTag = '';
    }
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }

  onImageSelect(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        this.productImages.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number): void {
    this.productImages.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }

  // ============ PRICING & STOCK TAB ============
  calculateProfit(): number {
    const cost = this.productForm.get('costPrice')?.value || 0;
    const selling = this.productForm.get('sellingPrice')?.value || 0;
    return selling - cost;
  }

  calculateMargin(): number {
    const cost = this.productForm.get('costPrice')?.value || 0;
    const selling = this.productForm.get('sellingPrice')?.value || 0;
    if (cost === 0) return 0;
    return ((selling - cost) / cost) * 100;
  }

  // ============ VARIANTS TAB ============
  toggleVariants(event: any): void {
    this.hasVariants = event.target.checked;
    if (!this.hasVariants) {
      this.variants = [];
    }
  }

  addVariant(): void {
    if (this.newVariant.size && this.newVariant.color && this.newVariant.sku && this.newVariant.price > 0) {
      const variant: ProductVariant = {
        ...this.newVariant,
        id: `variant-${Date.now()}`
      };
      this.variants.push(variant);
      this.newVariant = { id: '', size: '', color: '', sku: '', price: 0, stock: 0 };
    }
  }

  removeVariant(id: string): void {
    const index = this.variants.findIndex(v => v.id === id);
    if (index > -1) {
      this.variants.splice(index, 1);
    }
  }

  // ============ FORM SUBMISSION ============
  isFormValid(): boolean {
    return this.productForm.valid && this.productForm.get('name')?.value?.trim() !== '';
  }

  saveAsDraft(): void {
    const productData = this.compileProductData();
    productData.isDraft = true;
    this.dialogRef.close(productData);
  }

  addProduct(): void {
    if (!this.isFormValid()) {
      alert('Please fill in all required fields (Product Name, Category, Prices)');
      return;
    }

    const productData = this.compileProductData();
    console.log('Adding product:', productData);
    this.dialogRef.close(productData);
  }

  compileProductData(): Product {
    return {
      name: this.productForm.get('name')?.value,
      description: this.productForm.get('description')?.value,
      category: this.productForm.get('category')?.value,
      brand: this.productForm.get('brand')?.value,
      sku: this.productForm.get('sku')?.value,
      barcode: this.productForm.get('barcode')?.value,
      tags: this.tags,
      costPrice: this.productForm.get('costPrice')?.value,
      sellingPrice: this.productForm.get('sellingPrice')?.value,
      currentStock: this.productForm.get('currentStock')?.value,
      minimumStock: this.productForm.get('minimumStock')?.value,
      storageLocation: this.productForm.get('storageLocation')?.value,
      supplier: this.productForm.get('supplier')?.value,
      weight: this.productForm.get('weight')?.value,
      dimensions: {
        length: this.productForm.get('dimensionLength')?.value,
        width: this.productForm.get('dimensionWidth')?.value,
        height: this.productForm.get('dimensionHeight')?.value
      },
      taxable: this.productForm.get('taxable')?.value,
      trackInventory: this.productForm.get('trackInventory')?.value,
      allowBackorders: this.productForm.get('allowBackorders')?.value,
      requiresSerialNumber: this.productForm.get('requiresSerialNumber')?.value,
      hasExpiryDate: this.productForm.get('hasExpiryDate')?.value,
      hasVariants: this.hasVariants,
      variants: this.variants
    };
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
