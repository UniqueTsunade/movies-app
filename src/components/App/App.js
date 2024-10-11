import React from "react";
import CardsList from "../CardsList";

import ErrorBoundary from "../../utils/ErrorBoundary";

const App = () => {
  return (
    <div className="app-container">
      <ErrorBoundary>
        <CardsList />
      </ErrorBoundary>
    </div>
  );
};

export default App;
