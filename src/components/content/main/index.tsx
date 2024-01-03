"use client";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/CartStore";
import { Item, MenuApiResponse } from "@/types";
import Image from "next/image";
import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "sonner";
import { FaTrash } from "react-icons/fa";

type Props = {
  data: MenuApiResponse;
};

const MainContent = (props: Props) => {
  //state dan props
  const [isClient, setIsClient] = React.useState(false);
  const { data } = props;

  // store 
  const menus = useCartStore((state) => state.cart);
  const addProduct = useCartStore((state) => state.addProduct);
  const removeProduct = useCartStore((state) =>state.removeProduct)


  const handleAddToMenu =(item:Item) =>{
    addProduct(item);
    toast(`${item.nama} has been Added`, {
        description: "Success add to cart",
        action: {
          label: "Undo",
          onClick: () => removeProduct(item.id),
        },
      })
  }

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-2">
      {isClient && data.datas.map((item, index) => {
        const isItemInCart = menus.some((cartItem) => cartItem.id === item.id);
        return (
          <div className="p-6 space-y-2 border rounded-sm" key={index}>
            <div className="p-4 border-2 rounded-md">
              <img src={item.gambar} className="w-72 h-48" />
            </div>
            <div className="space-y-0.5">
              <h1 className="font-bold text-lg">{item.nama}</h1>
              <h2 className="text-muted-foreground">{item.tipe}</h2>
              <h3 className="text-primary text-lg font-semibold">Rp.{item.harga}</h3>
            </div>

            {isItemInCart ? (
              <Button
                onClick={() => removeProduct(item.id)}
                size={"full"}
                variant={"destructive"}
                className="flex flex-row items-center gap-2"
              >
                <FaTrash />
                <p>Hapus Dari Keranjang</p>
              </Button>
            ):(
                <Button onClick={() => handleAddToMenu(item)}  size={"full"} className="flex flex-row items-center gap-2">
                <FaShoppingCart />
                <p>Tambahkan Ke Keranjang</p>
                </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MainContent;
