"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/store/cart";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <Card className="overflow-hidden border-0 bg-card transition-all duration-300 group-hover:bg-accent">
        <CardContent className="p-4">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No image
              </div>
            )}
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="font-medium text-lg tracking-tight">
              {product.name}
            </h3>
            {/* <p className="text-muted-foreground">
              {formatPrice(product.price)}
            </p> */}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
