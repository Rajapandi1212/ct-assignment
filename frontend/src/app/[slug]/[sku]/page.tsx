import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productService } from '@/services/product.service';
import ProductDetail from '@/components/pdp/ProductDetail';
import { getLocale } from '@/utils/server-utils';

interface PDPPageProps {
  params: Promise<{
    slug: string;
    sku: string;
  }>;
}

export async function generateMetadata({
  params,
}: PDPPageProps): Promise<Metadata> {
  const { sku } = await params;
  const locale = await getLocale();

  try {
    const response = await productService.getProductBySku(sku, locale);
    const product = response.data;

    if (!product) {
      return {
        title: 'Product Not Found | RP Shopping',
        description: 'The requested product could not be found.',
      };
    }

    return {
      title: `${product.name} | RP Shopping`,
      description:
        product.description ||
        `Shop ${product.name} at RP Shopping. ${'Find great deals on quality products.'}`,
      openGraph: {
        title: `${product.name} | RP Shopping`,
        description:
          product.description || `Shop ${product.name} at RP Shopping.`,
        images: product.variants?.[0]?.images?.[0]?.url
          ? [{ url: product.variants?.[0]?.images?.[0]?.url }]
          : [],
      },
    };
  } catch (error) {
    return {
      title: 'Product Details | RP Shopping',
      description: 'View product details at RP Shopping.',
    };
  }
}

export default async function ProductDetailPage({ params }: PDPPageProps) {
  const { sku } = await params;
  const locale = await getLocale();

  let product = null;
  try {
    const response = await productService.getProductBySku(sku, locale);
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
