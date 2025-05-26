import { createBrowserRouter } from "react-router-dom";
import NotaList from "@/pages/nota/NotaList.tsx";
import DetailNota from "@/pages/pdf/DetailNota";
import PrintNota from "@/pages/pdf/PrintNota";
import NotaPage from "@/pages/detail-nota/NotaPage";

const routes = createBrowserRouter(
  [
    {
      path: "/",
      element: <NotaList />,
    },
    {
      path: "/tambah-nota",
      element: <NotaPage />,
    },
    {
      path: "/:notaId/preview-nota",
      element: <DetailNota />,
    },
    {
      path: "/:notaId/print",
      element: <PrintNota />,
    },
  ],
  {
    basename: "/nota/frontend",
  }
);

export default routes;
