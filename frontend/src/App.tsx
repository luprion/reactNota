import { RouterProvider } from "react-router-dom";
import routes from "@/router/routes";

function App() {
  return (
    // <div className="flex justify-center items-center min-h-screen bg-gray-100">
      // <div className="container mx-auto px-6 py-8">
        // <div className=" mx-auto bg-white shadow-lg rounded-lg p-10">
          <RouterProvider router={routes} />
    //     </div>
    //   </div>
    // </div>
  );
}

export default App;
