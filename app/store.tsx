import React, {createContext, useState} from 'react';

type StoreContextType = {
  showDescription: boolean;
  setShowDescription: React.Dispatch<React.SetStateAction<boolean>>;
};

const StoreContext = createContext<StoreContextType>({
  showDescription: false,
  setShowDescription: () => {},
});

const StoreProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [showDescription, setShowDescription] = useState<boolean>(false);

  return (
    <StoreContext.Provider value={{showDescription, setShowDescription}}>
      {children}
    </StoreContext.Provider>
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
