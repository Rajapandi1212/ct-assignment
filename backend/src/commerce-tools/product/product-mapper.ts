import {
  ProductProjection,
  ProductSearchResult,
  ProductVariant as CTProductVariant,
  Price as CTPrice,
} from '@commercetools/platform-sdk';
import { getLocaleInfo } from '../../utils/locale-info';
import { CT_DEFAULT_LOCALE } from '../../config/ct';
import {
  Product,
  ProductVariant,
  ProductAttribute,
  Price,
  Image,
} from '../../../../types/product';

export class ProductMapper {
  static ctProductToProduct(
    ctProduct: ProductSearchResult,
    locale: string
  ): Product {
    const productProjection =
      ctProduct.productProjection || ({} as ProductProjection);
    return ProductMapper.ctProductProjectionToProduct(
      productProjection,
      locale
    );
  }

  static ctProductProjectionToProduct(
    productProjection: ProductProjection,
    locale: string
  ) {
    const name = productProjection?.name?.[locale];
    const key = productProjection?.key;
    const productId = productProjection.id;
    const slug =
      productProjection?.slug?.[locale] ||
      productProjection?.slug?.[CT_DEFAULT_LOCALE];
    const description = productProjection?.description?.[locale];
    const variants = ProductMapper.ctVariantsToVariants(
      productProjection,
      locale
    );
    const url = `/${slug}/${key}`;

    return {
      name,
      key,
      productId,
      slug,
      description,
      variants,
      url,
    };
  }

  static ctVariantsToVariants(
    productProjection: ProductProjection,
    locale: string
  ): ProductVariant[] {
    const variants: ProductVariant[] = [];
    const masterVariant = productProjection.masterVariant;
    const mappedMasterVariant = ProductMapper.ctVariantToVariant(
      masterVariant,
      locale
    );
    variants.push(mappedMasterVariant);

    const otherVariants = productProjection.variants || [];
    if (otherVariants.length > 0) {
      otherVariants.forEach((variant) => {
        const mappedVariant = ProductMapper.ctVariantToVariant(variant, locale);
        variants.push(mappedVariant);
      });
    }
    return variants;
  }

  static ctVariantToVariant(
    ctVariant: CTProductVariant,
    locale: string
  ): ProductVariant {
    const { country, currency } = getLocaleInfo(locale);
    const sku = ctVariant.sku;
    const key = ctVariant.key;
    const attributes: ProductAttribute =
      ctVariant.attributes?.reduce((acc, attribute) => {
        const name = attribute?.name || '';
        const attributeValue = attribute?.value?.[locale] || attribute?.value;
        const value = attribute?.value?.key || attributeValue || '';
        const label = attribute?.value?.label?.[locale] || attributeValue || '';

        acc[name] = { value, label: label };
        return acc;
      }, {} as ProductAttribute) || {};

    const ctPrice: CTPrice | undefined =
      ctVariant.prices?.find(
        (price) =>
          price.country === country &&
          price.value.currencyCode === currency &&
          !price.channel
      ) ||
      ctVariant.prices?.find(
        (price) =>
          price.country === country &&
          price.value.currencyCode === currency &&
          price.channel
      ) ||
      ctVariant.prices?.[0];

    const price: Price | undefined = ctPrice
      ? {
          value: {
            centAmount: ctPrice.value.centAmount,
            currencyCode: ctPrice.value.currencyCode,
            fractionDigits: ctPrice.value.fractionDigits,
          },
          country: ctPrice.country,
          discounted: ctPrice.discounted
            ? {
                value: {
                  centAmount: ctPrice.discounted.value.centAmount,
                  currencyCode: ctPrice.discounted.value.currencyCode,
                  fractionDigits: ctPrice.discounted.value.fractionDigits,
                },
              }
            : undefined,
        }
      : undefined;

    const images: Image[] =
      ctVariant?.images?.map((img) => ({
        url: img.url,
        dimensions: {
          w: img.dimensions.w,
          h: img.dimensions.h,
        },
        label: img.label,
      })) || [];

    return {
      sku,
      key,
      attributes,
      price,
      images,
    };
  }
}
