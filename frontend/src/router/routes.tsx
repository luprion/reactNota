import { createBrowserRouter } from "react-router-dom";
import NotaList from "@/pages/nota/NotaList.tsx";
import Home from "@/pages/Home";
import AddNotaPage from "@/pages/nota/AddNota";
import DetailNota from "@/pages/detail-nota/DetailList";
import AddDetailPage from "@/pages/detail-nota/AddDetail";
import PostAllNota from "@/pages/detail-nota/PostAllNota";

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
    },
    {
        path: '/nota/:notaId/add-detail-nota',
        element: <AddDetailPage/>
    },
    {
        path: '/nota/add-nota',
        element: <PostAllNota/>
    },
])

export default routes