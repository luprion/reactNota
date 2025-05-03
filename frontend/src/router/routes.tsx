import { createBrowserRouter } from "react-router-dom";
import NotaList from "@/pages/nota/NotaList.tsx";
import DetailNota from "@/pages/detail-nota/DetailList";
import PostAllNota from "@/pages/detail-nota/PostAllNota";
import AddAllNota from "@/pages/detail-nota/AddAllNota";
import Nota from "@/pages/pdf/Nota";
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
        path: '/:notaId/preview-nota',
        element: <Nota/>
    },
    {
        path: '/:notaId/generate-nota',
        element: <Generate/>
    },
    {
        path: '/nota/add-nota',
        element: <PostAllNota/>
    },
])

export default routes