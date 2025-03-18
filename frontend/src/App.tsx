import { RouterProvider } from "react-router-dom";
import routes from "@/router/routes";

function App() {
  return (
    <>
      <div className="wrapper-all ">
        <div className="wrapper-content font-fira-sans">
          <RouterProvider router={routes}/>
        </div>
      </div>
    </>
  );
}

export default App;