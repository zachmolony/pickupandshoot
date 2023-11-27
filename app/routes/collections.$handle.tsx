import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';
import {useState} from 'react';
import Text from '~/components/Text';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  if (!handle) {
    return redirect('/collections');
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }
  return json({collection});
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const [currentItem, setCurrentItem] = useState(0);

  const previousItem = () => {
    if (currentItem > 0) {
      setCurrentItem(currentItem - 1);
    } else {
      setCurrentItem(collection.products.nodes.length - 1);
    }
  };

  const nextItem = () => {
    if (currentItem < collection.products.nodes.length - 1) {
      setCurrentItem(currentItem + 1);
    } else {
      setCurrentItem(0);
    }
  };

  return (
    <div className="collection">
      {collection.products.nodes.length > 1 && (
        <div className="mb-2" onClick={() => previousItem()}>
          <span>↑ Previous item</span>
        </div>
      )}
      <Pagination connection={collection.products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <>
            {/* <PreviousLink>
              {isLoading ? 'Loading...' : <span>↑ Previous item</span>}
            </PreviousLink> */}
            {[nodes[currentItem]].map((product, index) => {
              return (
                <ProductItem
                  key={product.id}
                  product={product}
                  loading={index < 1 ? 'eager' : undefined}
                />
              );
            })}
            {/* <NextLink>
              {isLoading ? 'Loading...' : <span>Next Item ↓</span>}
            </NextLink> */}
          </>
        )}
      </Pagination>
      {collection.products.nodes.length > 1 && (
        <div className="mt-2" onClick={() => nextItem()}>
          <span>Next Item ↓</span>
        </div>
      )}
    </div>
  );
}

function ProductItem({
  product,
  loading,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Link className="w-1/3" key={product.id} prefetch="intent" to={variantUrl}>
      <div className="flex gap-3">
        {product.featuredImage && (
          <div className="w-1/3">
            <Image
              alt={product.featuredImage.altText || product.title}
              aspectRatio="1/1"
              data={product.featuredImage}
              loading={loading}
              sizes="(min-width: 5em) 40px, 10vw"
            />
          </div>
        )}
        <div className="flex flex-col justify-between flex-grow">
          <h4>{product.title}</h4>
          <Money data={product.priceRange.minVariantPrice} />
          <Text colour="green">View Details</Text>
        </div>
      </div>
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
