import MainContent from '@/components/content/main';
import Header from '@/components/layout/header'
import { Separator } from '@/components/ui/separator';
import { MenuApiResponse } from '@/types';
import Image from 'next/image'

async function getMenus() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/menus`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch menus");
  }

  const data: MenuApiResponse = await response.json();

  //modified response add quantity
  const modifiedData: MenuApiResponse = {
    status_code: data.status_code,
    datas: data.datas.map((item) => ({
      ...item,
      quantity: item.quantity ?? 1,
    })),
  };

  return modifiedData;
}

export default async function Home() {
  const data = await getMenus();
  return (
    <main className="flex min-h-screen flex-col items-center p-16">
      <Header/>
      <Separator className='my-10'/>
      <MainContent data={data}/>
    </main>
  )
}
