import { ProductType } from '@commercetools/platform-sdk';
import { Filter, FilterValue } from '../../../types/product';

export class FacetBuilder {
  static buildFacets(
    productType: ProductType | undefined,
    ctFacets: any[],
    locale: string
  ): Filter[] {
    if (!productType || !ctFacets || ctFacets.length === 0) return [];

    const facets: Filter[] = [];

    // Process each facet from CT response
    ctFacets.forEach((ctFacet: any) => {
      // Extract attribute name from facet name (e.g., "variants.attributes.search-color" -> "search-color")
      const attributeName = ctFacet.name.split('.').pop();

      // Find the attribute definition in product type
      const attribute = productType.attributes?.find(
        (attr) => attr.name === attributeName
      );

      if (!attribute) return;

      // Determine filter key (remove "search-" prefix if exists)
      const filterKey = attributeName.replace('search-', '');

      // Get label from attribute definition
      const filterLabel =
        attribute.label?.[locale] ||
        attribute.label?.['en-US'] ||
        attributeName;

      // Build filter based on attribute type
      if (attribute.type.name === 'lenum' || attribute.type.name === 'enum') {
        const filter = this.buildEnumFilter(
          filterKey,
          filterLabel,
          attribute,
          ctFacet,
          locale
        );
        if (filter) facets.push(filter);
      } else if (attribute.type.name === 'boolean') {
        const filter = this.buildBooleanFilter(filterKey, filterLabel, ctFacet);
        if (filter) facets.push(filter);
      }
    });

    return facets;
  }

  private static buildEnumFilter(
    filterKey: string,
    filterLabel: string,
    attribute: any,
    ctFacet: any,
    locale: string
  ): Filter | null {
    const enumValues = attribute.type.values || [];

    if (enumValues.length === 0) return null;

    // Create a map of counts from CT facet response
    const countMap = new Map<string, number>();
    if (ctFacet.buckets) {
      ctFacet.buckets.forEach((bucket: any) => {
        countMap.set(bucket.key, bucket.count);
      });
    }

    // Build filter values from ALL enum values in product type
    const values: FilterValue[] = enumValues.map((enumValue: any) => {
      return {
        key: enumValue.key,
        label:
          enumValue.label?.[locale] ||
          enumValue.label?.['en-US'] ||
          enumValue.key,
        isSelected: false,
        count: countMap.get(enumValue.key) || 0,
      };
    });

    return {
      key: filterKey,
      label: filterLabel,
      type: 'checkbox',
      values,
    };
  }

  private static buildBooleanFilter(
    filterKey: string,
    filterLabel: string,
    ctFacet: any
  ): Filter | null {
    if (!ctFacet.buckets) return null;

    // Check if there's a 'true' bucket with count > 0
    const trueBucket = ctFacet.buckets.find(
      (bucket: any) => bucket.key === 'true' || bucket.key === true
    );

    if (!trueBucket || trueBucket.count === 0) return null;

    return {
      key: filterKey,
      label: filterLabel,
      type: 'boolean',
      isSelected: false,
    };
  }
}
