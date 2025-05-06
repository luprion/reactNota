import { createBrowserRouter } from "react-router-dom";
import NotaList from "@/pages/nota/NotaList.tsx";
import DetailNota from "@/pages/detail-nota/DetailList";
import AddAllNota from "@/pages/detail-nota/AddAllNota";
import Generate from "@/pages/pdf/Generate";

const routes = createBrowserRouter([
    {
        path: '/',
        element: <NotaList/>
    },
    {
        path: '/tambah-nota',
        element: <AddAllNota/>
    },
    {
        path: '/:notaId/detail-nota',
        element: <DetailNota/>
    },
    {
        path: '/nota/tambah-nota',
        element: <AddAllNota/>
    },
    {
        path: '/:notaId/generate-nota',
        element: <Generate/>
    },
])

export default routes