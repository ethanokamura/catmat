"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/lib/services/products";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main>
      {/* Header */}
      <header className="py-16 px-4 sm:px-6 text-center border-b">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
          Products
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Explore our collection of premium desk mats, designed to elevate your
          workspace.
        </p>
      </header>

      {/* Products Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {loading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-busy="true"
            aria-label="Loading products"
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-6 w-3/4 mt-4" />
                <Skeleton className="h-5 w-1/4 mt-2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg">
              No products available at the moment.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Check back soon for new arrivals!
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            aria-label="Products"
          >
            {products.map((product) => (
              <div key={product.id} role="listitem">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>
    </main>
  );
}
