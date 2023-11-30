import {Await, Link, useLocation} from '@remix-run/react';
import {Suspense, useEffect, useState} from 'react';
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

  const boxShadowStyle = {
    boxShadow: '0px 4px 4px 0px rgba(244, 226, 226, 0.22) inset',
  };

  const insetBoxShadowStyle = {
    boxShadow: '0px 4px 4px 0px rgba(244, 226, 226, 0.22)',
  };

  const innerScreenBoxShadowStyle = {
    boxShadow: 'rgb(0 0 0 / 22%) -13px 13px 4px 0px inset',
  };

  const sounds = ['/1.wav', '/2.wav', '/3.wav'];

  const playRandomSound = () => {
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    const sound = new Audio(randomSound);
    sound.volume = 0.3;
    sound.play();
  };

  useEffect(() => {
    let firstInteraction = true;

    window.addEventListener(
      'click',
      (e) => {
        if (firstInteraction) {
          // Play initial sound to unlock audio on iOS
          playRandomSound();
          // firstInteraction = false;
        }
      },
      // {once: true},
    );

    return () => {
      window.removeEventListener('click', playRandomSound);
    };
  }, []);

  const handleUserInteraction = () => {
    setIsEnterPage(false);
    // play background music
    const audio = document.getElementById(
      'background-audio',
    ) as HTMLAudioElement;
    audio.play();
  };

  return (
    <div className="absolute inset-0 h-[calc(100dvh)] overflow-hidden">
      <audio id="background-audio" autoPlay loop>
        <source src="/background-music.mp3" type="audio/mpeg" />
      </audio>
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
          style={{height: '53%', ...boxShadowStyle}}
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
                className="flex flex-col items-center w-11/12 h-full py-2 md:py-4 md-pro-max:py-6 justify-between"
                style={{maxWidth: '500px'}}
              >
                {isEnterPage && location.pathname === '/' ? (
                  <div className="flex flex-col items-center w-full h-full justify-evenly">
                    <img
                      src="https://cdn.shopify.com/s/files/1/0794/4008/5341/files/puas-spinner.gif?v=1701352471"
                      alt="puas-logo"
                      className="object-contain"
                    />
                    <button
                      className="uppercase cursor-pointer mb-6"
                      onClick={handleUserInteraction}
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
                        <Link className="cursor-pointer uppercase" to="/cart">
                          Cart(
                          <Suspense fallback={<>0</>}>
                            <Await resolve={cart}>
                              {(cart) => {
                                return cart?.totalQuantity;
                              }}
                            </Await>
                          </Suspense>
                          )
                        </Link>
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
