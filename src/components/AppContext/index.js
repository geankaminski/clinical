import React, { createContext } from 'react';

export const AppContext = createContext();

export default WrappedComponent => (props => (
  <AppContext.Consumer>
    {context => <WrappedComponent {...context} {...props} />}
  </AppContext.Consumer>
));
