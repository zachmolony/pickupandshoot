import {Await, useLocation} from '@remix-run/react';
import {Suspense, useState} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import Text from './Text';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: boolean;
};

export function Layout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
}: LayoutProps) {
  const [isEnterPage, setIsEnterPage] = useState(true);

  const location = useLocation();

  return (
    <>
      <div className="h-screen w-auto absolute object-cover -z-10">
        <img
          src="/puas-vid.gif"
          alt="puas-vid"
          className="h-full w-auto overflow-hidden filter blur-md"
        />
      </div>
      <div className="flex items-center w-screen h-screen uppercase">
        <div className="flex justify-center w-full h-2/5 bg-black py-8">
          <div className="flex flex-col items-center w-11/12 gap-2 h-full justify-between">
            {isEnterPage && location.pathname === '/' ? (
              <>
                <img src="/logo.png" alt="puas-logo" />
                <button
                  className="uppercase cursor-pointer"
                  onClick={() => setIsEnterPage(false)}
                >
                  <div
                    style={{height: '2rem'}}
                    className="px-8 w-full flash textFade"
                  >
                    press to enter
                  </div>
                </button>
              </>
            ) : (
              <>
                <Text colour="white">
                  <div className="flex justify-between w-full">
                    <button
                      className="cursor-pointer uppercase"
                      onClick={() => window.history.back()}
                      style={
                        location.pathname !== '/' ? {opacity: 1} : {opacity: 0}
                      }
                    >
                      Back
                    </button>
                    <div>Camera menu</div>
                    <button
                      className="cursor-pointer uppercase"
                      onClick={() => (window.location.href = '/cart')}
                    >
                      Cart
                    </button>
                  </div>
                </Text>
                <div className="flex flex-col w-11/12 my-3 gap-4">
                  <>{children}</>
                </div>
                <Text colour="white">Push menu to exit</Text>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function CartAside({cart}: {cart: LayoutProps['cart']}) {
  return (
    <Aside id="cart-aside" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside id="search-aside" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <PredictiveSearchForm>
          {({fetchResults, inputRef}) => (
            <div>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
              />
              &nbsp;
              <button type="submit">Search</button>
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  menu,
  shop,
}: {
  menu: HeaderQuery['menu'];
  shop: HeaderQuery['shop'];
}) {
  return (
    <Aside id="mobile-menu-aside" heading="MENU">
      <HeaderMenu
        menu={menu}
        viewport="mobile"
        primaryDomainUrl={shop.primaryDomain.url}
      />
    </Aside>
  );
}
