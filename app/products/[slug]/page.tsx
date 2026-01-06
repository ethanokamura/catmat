"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { getProductBySlug } from "@/lib/services/products";
import { Product } from "@/lib/types";
import { useCart, formatPrice } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductBySlug(resolvedParams.slug);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [resolvedParams.slug]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      setQuantity(1);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to Products
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Link */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <Link
            href="/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to Products
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No image available
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div
                className="flex gap-3 overflow-x-auto pb-2"
                role="listbox"
                aria-label="Product images"
              >
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      selectedImage === index
                        ? "ring-2 ring-primary"
                        : "ring-1 ring-border hover:ring-primary/50"
                    }`}
                    role="option"
                    aria-selected={selectedImage === index}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image src={image} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-3 text-3xl sm:text-4xl tracking-tight">
              <h1 className="font-bold">{product.name}</h1>
              {/* <h1
                className="text-muted-foreground"
                aria-label={`Price: ${formatPrice(product.price)}`}
              >
                {formatPrice(product.price)}
              </h1> */}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <Separator className="my-6" />

            {/* Dimensions */}
            <div className="flex flex-wrap items-start gap-x-10 gap-4">
              <div className="w-32">
                <h2 className="font-medium">Dimensions:</h2>
                <p className="text-sm text-muted-foreground">
                  {product.dimensions.width}&quot; × {product.dimensions.height}
                  &quot;
                </p>
              </div>
              <div className="w-32">
                <h2 className="font-medium">Thickness:</h2>
                <p className="text-sm text-muted-foreground">
                  {product.dimensions.thickness}mm
                </p>
              </div>
              <div className="w-32">
                <h2 className="font-medium">Surface:</h2>
                <p className="text-sm text-muted-foreground">Amundsen fabric</p>
              </div>
              <div className="w-32">
                <h2 className="font-medium">Base:</h2>
                <p className="text-sm text-muted-foreground">Natural rubber</p>
              </div>
              <div className="w-32">
                <h2 className="font-medium">Edges:</h2>
                <p className="text-sm text-muted-foreground">Stitched</p>
              </div>
            </div>

            {/* <Separator className="my-6" /> */}

            {/* Quantity & Add to Cart */}
            {/* <div className="space-y-4">
              <div>
                <label htmlFor="quantity" className="font-medium block mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <span
                    id="quantity"
                    className="w-12 text-center tabular-nums text-lg"
                    aria-live="polite"
                  >
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {product.stock <= 0 ? (
                  "Out of Stock"
                ) : (
                  <>Add to Cart — {formatPrice(product.price * quantity)}</>
                )}
              </Button>

              {product.stock > 0 && product.stock <= 5 && (
                <p
                  className="text-sm text-amber-600 dark:text-amber-400 text-center"
                  role="status"
                >
                  Only {product.stock} left in stock
                </p>
              )}
            </div> */}

            {/* Additional Info */}
            {/* <div className="mt-8 space-y-3 text-sm text-muted-foreground">
              <p>✓ Free shipping on orders over $50</p>
              <p>✓ 30-day return policy</p>
              <p>✓ Premium quality guaranteed</p>
            </div> */}
          </div>
        </div>
      </div>
    </main>
  );
}
