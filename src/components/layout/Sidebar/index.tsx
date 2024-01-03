"use client";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FaMinus, FaPlus, FaShoppingCart, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemLastOrder,
  Order,
  Voucher,
  VouchersApiResponse,
} from "@/types";
import { useCartStore } from "@/store/CartStore";
import { toast } from "react-toastify";
import { toast as ToastSonner } from "sonner";

type Props = {
  vouchers: VouchersApiResponse;
};

const Sidebar = (props: Props) => {
  //state
  const [data, setData] = useState<Order | any>();
  const [totalHarga, setTotalHarga] = useState(0);
  const { datas } = props.vouchers;

  //store
  const menus = useCartStore((state) => state.cart);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const removeAll = useCartStore((state) => state.removeAll);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const handleAddCatatan = ({ id, text }: { id: number; text: string }) => {
    setData((prevData: Order) => {
      return {
        ...prevData,
        items: prevData.items.map((item: any) => {
          if (item.id === id) {
            return {
              ...item,
              catatan: text,
            };
          }
          return item;
        }),
      };
    });
  };

  const handleAddVouchers = (type: string) => {
    const voucher = datas.find((voucher: Voucher) => voucher.kode === type);
    setData((prevData: Order) => {
      return {
        ...prevData,
        voucher_id: voucher?.id,
        nominal_diskon: voucher?.nominal,
      };
    });
  };

  const handleSubmit = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/order`;
    try {
      // requestBody yang quantitynya ada di field
      // const requestBody: Order = {
      //   nominal_pesanan: totalHarga,
      //   nominal_diskon: data?.nominal_diskon || 0,
      //   items:
      //     data?.items.map((item: ItemLastOrder) => ({
      //       id: item.id,
      //       catatan: item.catatan || "test",
      //       harga: item.harga,
      //       quantity: item.quantity,
      //     })) || [],
      // };

      //requestBody yang quantitynya nya di loop
      const requestBody: Order = {
        nominal_pesanan: data?.nominal_pesanan,
        nominal_diskon: data?.nominal_diskon || 0,
        items: data?.items.flatMap((item: ItemLastOrder) => (
          Array.from({ length: item.quantity || 1 }, (_, index:number) => ({
            id: item.id,
            catatan: item.catatan || "test",
            harga: item.harga,
          }))
        )) || [],
      };
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const result = await response.json();
      console.log(result, requestBody);
      if (result.status_code === 200) {
        removeAll();
        toast.success("🙂 Pembelian Berhasil", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        ToastSonner(`Mau Cancel?`, {
          description: "Cancel Pemesanan",
          action: {
            label: "Undo",
            onClick: () => cancelOrder(result.id),
          },
        });
      } else {
        toast.error("🤧 Pembelian Gagal", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleIncrementAndDecrementQuantity = ({
    method,
    id,
    quantityNow,
  }: {
    method: string;
    id: number;
    quantityNow: number;
  }) => {
    const finalQuantity = method === "plus" ? quantityNow + 1 : quantityNow - 1;
    updateQuantity(id, finalQuantity);
  };

  const cancelOrder = async (id: number) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/order/cancel/${id}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result, data);
      if (result.status_code === 200) {
        removeAll();
        toast.success("😪 Pembelian Berhasil digagalkan", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error("😀 Cancel order gagal", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setData((prevData: Order) => {
      return {
        ...prevData,
        nominal_pesanan: menus.reduce(
          (total, item) => total + item.harga * (item.quantity || 1),
          0
        ),
        items: menus.map((item, index) => {
          const existingItem =
            prevData &&
            prevData.items.find((prevItem: any) => prevItem.id === item.id);
          return {
            id: item.id,
            catatan: existingItem ? existingItem.catatan : "test",
            harga: item.harga,
            quantity: item.quantity,
          };
        }),
      };
    });
  }, [menus]);

  useEffect(() => {
    const nominalDiskon = data?.nominal_diskon || 0;
    const nominalPesanan = data?.nominal_pesanan;

    const calculatedTotalHarga =
      nominalDiskon > nominalPesanan ? 0 : nominalPesanan - nominalDiskon;

    setTotalHarga(calculatedTotalHarga);
  }, [data]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="flex flex-row items-center gap-2 ">
          <FaShoppingCart />
          <p>Keranjang</p>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-[500px] min-h-screen">
        <DrawerHeader>
          <DrawerTitle className="text-lg flex flex-row items-center gap-1 text-primary">
            {" "}
            <FaShoppingCart className="text-2xl" />
            Keranjang Pembelian
          </DrawerTitle>
          <DrawerDescription>
            Periksa kembali pesanan anda dan jangan lupa menggunakan voucher
            kami 😁
          </DrawerDescription>
        </DrawerHeader>
        <div className="w-full max-h-[50vh] overflow-auto p-5 space-y-5">
          {menus.length > 0 ? (
            menus.map((item, index) => (
              <React.Fragment key={index}>
                <div className="grid grid-cols-3 items-center gap-2 w-full relative">
                  <div className="p-2 border-2 col-span-1 rounded-md flex items-center">
                    <img
                      className="w-32 h-20"
                      src={item.gambar}
                      alt={item.nama}
                    />
                  </div>
                  <div className="col-span-2 flex flex-col font-medium text-sm space-y-1">
                    <h1 className="text-lg">{item.nama}</h1>
                    <h2 className="text-muted-foreground">{item.tipe}</h2>
                    <h3 className="text-primary">Rp.{item.harga}</h3>
                    <div className="flex flex-row items-center gap-1 w-full justify-end">
                      {item.quantity > 1 && (
                        <Button
                          size={"icon"}
                          onClick={() =>
                            handleIncrementAndDecrementQuantity({
                              method: "minus",
                              id: item.id,
                              quantityNow: item.quantity,
                            })
                          }
                        >
                          <FaMinus />{" "}
                        </Button>
                      )}

                      <h1>{item.quantity}</h1>
                      <Button
                        size={"icon"}
                        onClick={() =>
                          handleIncrementAndDecrementQuantity({
                            method: "plus",
                            id: item.id,
                            quantityNow: item.quantity,
                          })
                        }
                      >
                        <FaPlus />{" "}
                      </Button>
                    </div>
                    <Button
                      className="absolute right-0 top-0"
                      size={"icon"}
                      onClick={() => removeProduct(item.id)}
                      variant={"destructive"}
                    >
                      x
                    </Button>
                  </div>
                </div>
                <Input
                  onChange={(e) =>
                    handleAddCatatan({ id: item.id, text: e.target.value })
                  }
                  placeholder="Masukkan catatan anda disini"
                />
              </React.Fragment>
            ))
          ) : (
            <div className="flex justify-center items-center text-2xl text-muted-foreground font-bold">
              Keranjang Kosong
            </div>
          )}
        </div>

        {menus.length > 0 && (
          <>
            <div className="p-5 space-y-0.5">
              <h1 className="text-sm text-primary">Pilih Voucher disini</h1>
              <Select onValueChange={(e: string) => handleAddVouchers(e)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Voucher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Vouchers</SelectLabel>
                    {datas.map((item, index) => (
                      <SelectItem key={index} value={item.kode}>
                        {item.kode} /{" "}
                        <span className="text-primary">Rp.{item.nominal}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <DrawerFooter>
              <div className="space-y-1">
                <div className=" font-medium flex justify-between text-sm">
                  <p>Total Pesanan</p>
                  <p>Rp.{data?.nominal_pesanan}</p>
                </div>
                {data?.nominal_diskon ? (
                  <div className=" font-medium flex justify-between text-sm">
                    <p>Discount</p>
                    <p>Rp.{data?.nominal_diskon}</p>
                  </div>
                ) : null}
                <div className=" font-medium flex justify-between text-sm">
                  <p>Total Harga</p>
                  <p>Rp.{totalHarga}</p>
                </div>
              </div>

              <DrawerClose asChild>
                <Button
                  className="bg-green-700 hover:bg-green-600"
                  onClick={handleSubmit}
                >
                  Order
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button
                  variant="destructive"
                  size={"full"}
                  className="flex flex-row items-center gap-2"
                >
                  <FaTrash />
                  Remove All
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
