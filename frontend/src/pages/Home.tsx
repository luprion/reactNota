import { useGetAllNota } from '@/services/queries'
import React from 'react'


const Home = () => {
    const {data} = useGetAllNota();

  return (
    <div>home</div>
  )
}

export default Home