import { notFound } from 'next/navigation';
import { productService } from '@/services/product.service';
import ProductDetail from '@/components/pdp/ProductDetail';

interface PDPPageProps {
  params: Promise<{
    slug: string;
    sku: string;
  }>;
}

export default async function ProductDetailPage({ params }: PDPPageProps) {
  const { sku } = await params;

  let product = null;
  try {
    const response = await productService.getProductBySku(sku);
    product = response.data;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="py-8">
      <ProductDetail product={product} />
    </div>
  );
}
