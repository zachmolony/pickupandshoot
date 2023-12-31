import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import Text from '~/components/Text';

export const meta: MetaFunction = () => {
  return [{title: "Pick Up 'n Shoot | Home"}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({collections, featuredCollection, recommendedProducts});
}

const content = {
  homepage: {
    items: [
      {text: '1.Shop', link: '/collections/frontpage'},
      {text: '2.camera setup', link: '/error'},
      {text: '3.display setup', link: '/error'},
      {text: '4.other functions', link: '/error'},
    ],
  },
  shop: {
    items: [
      {text: '1.All items', link: '/collections'},
      {text: '2.Tees', link: '/collections/error'},
      {text: '3.Keyrings', link: '/collections/error'},
      {text: '4.Posters', link: '/collections/error'},
    ],
  },
};

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      {content.homepage.items.map(({text, link}, index) => (
        <Link
          key={link}
          to={link}
          prefetch="intent"
          className="w-8/12 whitespace-nowrap"
        >
          <Text key={text} colour={index === 0 ? 'green' : undefined}>
            {text}
          </Text>
        </Link>
      ))}
    </>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  return (
    <Link to={`/collections/${collection.handle}`}>
      <Text key={collection.title} colour="">
        {collection.title}
      </Text>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h4>{product.title}</h4>
                  <small>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
