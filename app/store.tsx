import React, {createContext, useState} from 'react';

type StoreContextType = {
  showDescription: boolean;
  showLogo: boolean;
  setShowDescription: React.Dispatch<React.SetStateAction<boolean>>;

  setShowLogo: React.Dispatch<React.SetStateAction<boolean>>;
};

const StoreContext = createContext<StoreContextType>({
  showDescription: false,
  showLogo: false,
  setShowDescription: () => {},
  setShowLogo: () => {},
});

const StoreProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const [showLogo, setShowLogo] = useState<boolean>(true);

  const value = {
    showDescription,
    showLogo,
    setShowDescription,
    setShowLogo,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

const useStore = (): StoreContextType => {
  const context = React.useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export {StoreProvider, useStore};
