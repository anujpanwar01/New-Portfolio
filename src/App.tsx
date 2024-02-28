import React from "react";
function App() {
  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== "development" &&
      "serviceWorker" in navigator
    ) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log("SW registered: ", registration);
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }
  }, []);
  return <div className="App"></div>;
}
//    /* "start": "cross-env NODE_ENV=development webpack-dev-server  --mode development",*/
export default App;
