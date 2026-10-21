import React from "react";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// One page and a 404. A router would add about 10 KB of JavaScript for that.
const isHome = () => {
  const path = window.location.pathname.replace(/\/index\.html$/, "/");
  return path === "/" || path === "";
};

const App = () => (isHome() ? <Landing /> : <NotFound />);

export default App;
