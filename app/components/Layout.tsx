import {Await, useLocation} from '@remix-run/react';
import {Suspense, useState} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import Text from './Text';
import {useStore} from '~/store';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: boolean;
};

export function Layout({cart, children = null, header}: LayoutProps) {
  const [isEnterPage, setIsEnterPage] = useState(true);
  const location = useLocation();
  const {setShowDescription, showDescription} = useStore();

  const goBack = () => {
    if (
      window.location.pathname.includes('/products/') &&
      showDescription === true
    ) {
      setShowDescription(false);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="absolute inset-0 h-[calc(100dvh)] overflow-hidden">
      <div className="h-full w-auto absolute object-cover -z-10 overflow-hidden">
        <img
          src="/puas-vid.gif"
          alt="puas-vid"
          className="h-full w-auto overflow-hidden filter blur-md"
        />
      </div>
      <div className="flex items-center w-full h-full uppercase overflow-hidden">
        <div className="flex justify-center w-full h-2/5 bg-black py-4">
          <div className="flex flex-col items-center w-11/12 h-full justify-between bg-black">
            {isEnterPage && location.pathname === '/' ? (
              <div className="flex flex-col items-center w-full h-full justify-evenly">
                <img
                  src="/logo.png"
                  alt="puas-logo"
                  className="object-contain"
                />
                <button
                  className="uppercase cursor-pointer mb-6"
                  onClick={() => setIsEnterPage(false)}
                >
                  <div
                    style={{height: '1.7rem'}}
                    className="px-8 w-full flash textFade"
                  >
                    press to enter
                  </div>
                </button>
              </div>
            ) : (
              <>
                <Text colour="white">
                  <div className="flex justify-between w-full">
                    <button
                      className="cursor-pointer uppercase"
                      onClick={goBack}
                      style={
                        location.pathname !== '/' ? {opacity: 1} : {opacity: 0}
                      }
                    >
                      Back&nbsp;&nbsp;&nbsp;
                    </button>
                    <div onClick={() => (window.location.href = '/')}>
                      Camera menu
                    </div>
                    <button
                      className="cursor-pointer uppercase"
                      onClick={() => (window.location.href = '/cart')}
                    >
                      Cart(
                      <Suspense fallback={<>0</>}>
                        <Await resolve={cart}>
                          {(cart) => {
                            return cart?.totalQuantity;
                          }}
                        </Await>
                      </Suspense>
                      )
                    </button>
                  </div>
                </Text>
                <div className="flex flex-col h-full w-11/12 my-1 justify-evenly">
                  <>{children}</>
                </div>
                <Text colour="white">Push menu to exit</Text>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
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
