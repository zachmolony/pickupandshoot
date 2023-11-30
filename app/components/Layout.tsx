import {Await, Link, useLocation} from '@remix-run/react';
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

  const borderStyle = {
    borderTop: '20px',
    borderBottom: '20px',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  };

  const boxShadowStyle = {
    boxShadow: '0px 4px 4px 0px rgba(244, 226, 226, 0.22) inset',
  };

  const insetBoxShadowStyle = {
    boxShadow: '0px 4px 4px 0px rgba(244, 226, 226, 0.22)',
  };

  const innerScreenBoxShadowStyle = {
    boxShadow: 'rgb(0 0 0 / 22%) -13px 13px 4px 0px inset',
  };

  return (
    <div className="absolute inset-0 h-[calc(100dvh)] overflow-hidden">
      <div className="h-full w-auto absolute object-cover -z-10 overflow-hidden">
        <img
          src="/puas-vid.gif"
          alt="puas-vid"
          className="h-full w-auto overflow-hidden object-cover filter blur-md"
        />
      </div>
      <div className="flex items-center w-full h-full uppercase overflow-hidden">
        <div
          className="flex justify-center w-full bg-black py-10"
          style={{height: '45%', ...boxShadowStyle}}
        >
          <div
            className="flex flex-col items-center w-full h-full justify-between bg-screen"
            style={insetBoxShadowStyle}
          >
            <div
              className="flex flex-col items-center w-full h-full justify-between"
              style={innerScreenBoxShadowStyle}
            >
              <div
                className="flex flex-col items-center w-11/12 h-full py-6 justify-between"
                style={{maxWidth: '500px'}}
              >
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
                            location.pathname !== '/'
                              ? {opacity: 1}
                              : {opacity: 0}
                          }
                        >
                          Back&nbsp;&nbsp;&nbsp;
                        </button>
                        <div>
                          <Link to="/">Camera menu</Link>
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
                    <Text colour="white">
                      <Link to="/">Push menu to exit</Link>
                    </Text>
                  </>
                )}
              </div>
            </div>
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
