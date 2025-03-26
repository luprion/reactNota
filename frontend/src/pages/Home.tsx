import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Admin from '@/assets/admin.gif'

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <img src={Admin} width={500} />
      <h1 className="text-4xl font-bold text-gray-800">Selamat Datang di NotaApp</h1>
      <p className="text-gray-600 mt-2 max-w-lg">
        Kelola dan buat nota dengan mudah dan cepat. Hemat waktu dalam pencatatan transaksi Anda.
      </p>
      <Button 
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        onClick={() => navigate('/nota')}
      >
        Buat Nota Baru
      </Button>
    </div>
  );
};

export default Home;
