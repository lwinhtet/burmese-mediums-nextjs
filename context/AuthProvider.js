// import { createContext, useState } from 'react';

// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({});
//   return (
//     <AuthContext.Provider value={{ auth, setAuth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;

import { createContext, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isLoggedIn: null });

  const redirectKey = 'login_redirect';
  function setRedirect(redirect) {
    window.sessionStorage.setItem(redirectKey, redirect);
  }
  function getRedirect() {
    return window.sessionStorage.getItem(redirectKey);
  }
  function clearRedirect() {
    return window.sessionStorage.removeItem(redirectKey);
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        setRedirect,
        getRedirect,
        clearRedirect
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
