import { createBrowserRouter } from "react-router-dom";
import NotaList from "@/pages/nota/NotaList.tsx";
import Home from "@/pages/Home";
import AddNotaPage from "@/pages/nota/AddNota";
import DetailNota from "@/pages/detail-nota/DetailList";

const routes = createBrowserRouter([
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/nota',
        element: <NotaList/>
    },
    {
        path: '/tambah-nota',
        element: <AddNotaPage/>
    },
    {
        path: '/nota/:notaId/detail-nota',
        element: <DetailNota/>
    }
])

export default routes