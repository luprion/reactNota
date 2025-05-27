import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import { format, addMonths } from "date-fns";
import { useCreateNota } from "@/services/mutations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";

export type  BarangDetail = {
  nama_barang: string;
  coly: number;
  satuan_coly: string;
  qty_isi: number;
  nama_isi: string;
  harga: number;
  diskon: number;
  jumlah: number;
  total: number;
};


const NotaPage = () => {
  const formatDate = (date) => format(date, "yyyy-MM-dd");

  function formatRibuan(angka: number | string): string {
    const num = typeof angka === "string" ? parseFloat(angka) : angka;
    if (isNaN(num)) return "0";
    return num.toLocaleString("id-ID");
  }

  const now = new Date();
  const tempo = addMonths(now, 2);

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      no_nota: "",
      tanggal: formatDate(now),
      jt_tempo: formatDate(tempo),
      pembeli: "",
      alamat: "",
    },
  });

  const [barang, setBarang] = useState<BarangDetail[]>([]);
  const [formDetail, setFormDetail] = useState({
    nama_barang: "",
    coly: 0.00,
    satuan_coly: "",
    qty_isi: 0.00,
    nama_isi: "",
    harga: 0.00,
    diskon: 0.00,
  });

  const [editIndex, setEditIndex] = useState(null);
  const [diskonPersen, setDiskonPersen] = useState(0);
  const [diskonRupiah, setDiskonRupiah] = useState(0);
  const { mutate: createNota } = useCreateNota();

  const totalBarang = barang.map((item) => ({
    ...item,
    jumlah: parseFloat(Number(item.coly).toFixed(2)) * parseFloat(Number(item.qty_isi).toFixed(2)),
    total: parseFloat(Number(item.coly).toFixed(2)) * parseFloat(Number(item.qty_isi).toFixed(2)) * parseFloat(Number(item.harga).toFixed(2)) * (1 - item.diskon / 100),
  }));

  const subtotal = totalBarang.reduce((sum, item) => sum + item.total, 0);
  const totalHarga = subtotal - diskonRupiah;
  const totalColy = totalBarang.reduce((sum, item) => sum + item.coly, 0);

  useEffect(() => {
    const fetchNoNota = async () => {
      const res = await fetch("http://localhost:3000/nota/next-number");
      const data = await res.json();
      const noNotaFormatted = data.no_nota;
      // console.log(noNotaFormatted, "no nota");

      // Masukkan hasil ke form
      setValue("no_nota", noNotaFormatted);
    };

    fetchNoNota();
  }, [setValue]);

  const onSubmit = (data) => {
    if (barang.length === 0) {
      Swal.fire("Tidak ada detail barang yang ditambahkan.");
      return;
    }

    const payload = {
      ...data,
      subtotal,
      diskon_persen: diskonPersen,
      diskon_rupiah: diskonRupiah,
      total_harga: totalHarga,
      total_coly: totalColy,
      details: totalBarang,
    };

    createNota(payload, {
      onSuccess: (res) => {
        const notaId = res.payload.datas.nota_id;
        Swal.fire("Berhasil", "Nota berhasil dibuat", "success").then(() => {
          window.location.href = "/";
          // window.open(`/nota/frontend/${notaId}/print`, "_blank");
        });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          Swal.fire(
            "Gagal",
            error.response?.data || "Terjadi kesalahan",
            "error"
          );
        } else {
          Swal.fire("Gagal", "Terjadi kesalahan yang tidak terduga", "error");
        }
      },
    });
    reset({
      ...data,
      tanggal: formatDate(now),
      pembeli: "",
      alamat: "",
      jt_tempo: formatDate(tempo),
      details: [
        {
          nama_barang: "",
          coly: "",
          satuan_coly: "",
          qty_isi: "",
          nama_isi: "",
          harga: "",
          diskon: "",
        },
      ],
    });
    setBarang([]);
    setDiskonPersen(0);
    setDiskonRupiah(0);
  };

  const handleCancel = () => {
    setFormDetail({
      nama_barang: "",
      coly: 0,
      satuan_coly: "",
      qty_isi: 0,
      nama_isi: "",
      harga: 0,
      diskon: 0,
    });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    // setFormDetail(barang[index]);
    setEditIndex(index);
  };

  const saveEdit = (index) => {
    const updatedBarang = [...barang];
    const item = updatedBarang[index];
    item.jumlah = item.coly * item.qty_isi;
    item.total = item.jumlah * item.harga * (1 - item.diskon / 100);
    updatedBarang[index] = item;
    setBarang(updatedBarang);
    setEditIndex(null);
  };

  const removeDetail = (index) => {
    const newList = [...barang];
    newList.splice(index, 1);
    setBarang(newList);
  };

  const inputNamaBarang = useRef<HTMLInputElement>(null);
  const inputTanggal = useRef<HTMLInputElement>(null);
  const inputTempo = useRef<HTMLInputElement>(null);

  const addDetail = () => {
    const jumlah = parseFloat((formDetail.coly * formDetail.qty_isi).toFixed(2));
    const total =
      jumlah *
      parseFloat(formDetail.harga.toFixed(2)) *
      (1 - parseFloat(formDetail.diskon.toFixed(2)) / 100);   setBarang([...barang, { ...formDetail, jumlah, total }]);
    setFormDetail({
      nama_barang: "",
      coly: 0.00,
      satuan_coly: "",
      qty_isi: 0.00,
      nama_isi: "",
      harga: 0.00,
      diskon: 0.00,
    });
    inputNamaBarang.current?.focus();
  };

  // function parseNumericInput(target: EventTarget & HTMLInputElement): number {
  //   console.log(target.value);
    
  //   const rawInput = target.value;
  //   const cleaned = rawInput.replace(/[^0-9.]/g, "");
  //   const parts = cleaned.split(".");
  //   const validNumber =
  //     parts.length > 1
  //       ? `${parts[0]}.${parts.slice(1).join("")}` // gabungkan hanya satu titik
  //       : cleaned;

  //   return parseFloat(validNumber) || 0;
  // }

  return (
    <div className="p-4 mx-8 text-lg">
      <h1 className="text-2xl font-bold mb-12 text-center">Faktur</h1>

      {/* Header Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-4">
        <div className="space-y-2">
          <div className="flex gap-8 items-center">
            <label>Nota:</label>
            <div className="w-1/3">
              <Input {...register("no_nota")} disabled className="text-xl" />
            </div>
          </div>
          {/* <div className="flex gap-2 items-center">
            <label>Tanggal:</label>
            <Input
              {...register("tanggal")}
              type="date"
              className="w-1/2 border px-2 py-1 rounded"
            />
          </div>
          <div className="flex gap-5 items-center">
            <label>Jt.Tmp:</label>
            <Input
              {...register("jt_tempo")}
              type="date"
              className="w-1/2 border px-2 py-1 rounded"
            />
          </div> */}
          <div className="flex gap-2 items-center">
            <label>Tanggal:</label>
            <div className="relative w-1/3">
              <Input
                {...register("tanggal")}
                ref={(el) => {
                  register("tanggal").ref(el);
                  inputTanggal.current = el;
                }}
                type="date"
                className="w-full border border-input rounded px-4 py-2 pr-10"
              />
              <Calendar
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={() =>
                  inputTanggal.current?.showPicker?.() ||
                  inputTanggal.current?.focus()
                } // 👈 Buka date picker (Chrome/Edge)
              />
            </div>
          </div>
          <div className="flex gap-5 items-center">
            <label>Jt.Tmp:</label>
            <div className="relative w-1/3">
              <Input
                {...register("jt_tempo")}
                ref={(el) => {
                  register("jt_tempo").ref(el);
                  inputTempo.current = el;
                }}
                type="date"
                className="pr-10 border px-2 py-1 rounded"
              />
              <Calendar
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer"
                onClick={() =>
                  inputTempo.current?.showPicker?.() ||
                  inputTempo.current?.focus()
                }
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex gap-8 items-center">
            <p>Kepada Yth</p>
          </div>
          <div className="flex gap-2 items-center">
            <label>Pembeli:</label>
            <Input
              {...register("pembeli")}
              placeholder="Nama Pembeli"
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="flex gap-5 items-center">
            <label>Alamat:</label>
            <Input
              {...register("alamat")}
              placeholder="Alamat"
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="text-xl px-4 py-5"
        >
          Simpan Nota
        </Button>
      </div>
      {/* Table Section */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-200">
            <tr className="text-center">
              <th className="p-2 w-[2%]">No</th>
              <th className="p-2 w-[25%] text-left">Nama Barang</th>
              <th className="p-2 w-[12%]">Coly</th>
              <th className="p-2 w-[12%]">Qty</th>
              <th className="p-2 w-[12%]">Total Qty</th>
              <th className="p-2 w-[8%] text-center">Harga</th>
              <th className="p-2 w-[5%] text-center">Diskon</th>
              <th className="p-2 w-[10%] text-center">Sub Total</th>
              <th className="p-2 w-[9%]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {/* {barang.map((item, index) => (
              <tr key={index} className="border-t uppercase text-center">
                <td className="p-2">{index + 1}</td>
                <td className="p-2 text-left">
                  {editIndex === index ? (
                    <Input
                      value={item.nama_barang}
                      onChange={(e) => {
                        const newList = [...barang];
                        newList[index].nama_barang = e.target.value;
                        setBarang(newList);
                      }}
                    />
                  ) : (
                    item.nama_barang
                  )}
                </td>
                <td className="p-2">
                  {editIndex === index ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={item.coly}
                        onChange={(e) => {
                          const newColy = +e.target.value;
                          const newList = [...barang];
                          newList[index].coly = newColy;
                          newList[index].jumlah =
                            newList[index].qty_isi * newColy;
                          setBarang(newList);
                        }}
                      />
                      <Input
                        value={item.satuan_coly}
                        onChange={(e) => {
                          const newList = [...barang];
                          newList[index].satuan_coly = e.target.value;
                          setBarang(newList);
                        }}
                      />
                    </div>
                  ) : (
                    `${item.coly} ${item.satuan_coly}`
                  )}
                </td>
                <td className="p-2">
                  {editIndex === index ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={item.qty_isi}
                        onChange={(e) => {
                          const newQty = +e.target.value;
                          const newList = [...barang];
                          newList[index].qty_isi = newQty;
                          newList[index].jumlah = newList[index].coly * newQty;
                          setBarang(newList);
                        }}
                      />
                      <Input
                        value={item.nama_isi}
                        onChange={(e) => {
                          const newList = [...barang];
                          newList[index].nama_isi = e.target.value;
                          setBarang(newList);
                        }}
                      />
                    </div>
                  ) : (
                    `${item.qty_isi} ${item.nama_isi}`
                  )}
                </td>
                <td className="p-2">
                  {item.jumlah} {item.nama_isi}
                </td>
                <td className="p-2 text-right">
                  {editIndex === index ? (
                    <Input
                      value={item.harga}
                      onChange={(e) => {
                        const newList = [...barang];
                        newList[index].harga = +e.target.value;
                        setBarang(newList);
                      }}
                    />
                  ) : (
                    `${formatRibuan(item.harga)}`
                  )}
                </td>
                <td className="p-2 text-right">
                  {editIndex === index ? (
                    <Input
                      value={item.diskon}
                      onChange={(e) => {
                        const newList = [...barang];
                        newList[index].diskon = +e.target.value;
                        setBarang(newList);
                      }}
                    />
                  ) : (
                    `${item.diskon} %`
                  )}
                </td>
                <td className="p-2 text-right">{formatRibuan(item.total)}</td>
                <td className="p-2 flex gap-3" colSpan={2}>
                  {editIndex === index ? (
                    <>
                      <button
                        onClick={() => saveEdit(index)}
                        className="b-simpan"
                      >
                        <CheckIcon size={16} />
                      </button>
                      <button onClick={handleCancel} className="b-batal">
                        <XIcon size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(index)}
                      className="b-edit"
                    >
                      <PencilIcon size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => removeDetail(index)}
                    className="b-delete"
                  >
                    <TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))} */}

            {barang.map((item, index) => (
              <tr key={index} className="border-t uppercase text-center">
                <td className="p-2">{index + 1}</td>
                <td className="p-2 text-left">
                  <Input
                    value={item.nama_barang}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const newList = [...barang];
                      newList[index].nama_barang = e.target.value;
                      setBarang(newList);
                    }}
                  />
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={item.coly.toFixed(2)}
                      onFocus={(e) => e.target.select()}
                      // step={0.00}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value.replace(",", "."));
                        const newColy = isNaN(value) ? 0 : parseFloat(value.toFixed(2));
                        const newList = [...barang];
                        newList[index].coly = newColy;
                        newList[index].jumlah =
                          newList[index].qty_isi * newColy;
                        setBarang(newList);
                      }}
                    />
                    <Input
                      value={item.satuan_coly}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const newList = [...barang];
                        newList[index].satuan_coly = e.target.value;
                        setBarang(newList);
                      }}
                    />
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={item.qty_isi.toFixed(2)}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value.replace(",", "."));
                        const newQty = isNaN(value) ? 0 : parseFloat(value.toFixed(2));
                        const newList = [...barang];
                        newList[index].qty_isi = newQty;
                        newList[index].jumlah = newList[index].coly * newQty;
                        setBarang(newList);
                      }}
                    />
                    <Input
                      value={item.nama_isi}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const newList = [...barang];
                        newList[index].nama_isi = e.target.value;
                        setBarang(newList);
                      }}
                    />
                  </div>
                </td>
                <td className="p-2">
                  {item.jumlah} {item.nama_isi}
                </td>
                <td className="p-2 text-right">
                  <Input
                    type="text"
                    value={item.harga.toFixed(2)}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value.replace(",", "."));
                      const newHarga = isNaN(value) ? 0 : parseFloat(value.toFixed(2));
                      const newList = [...barang];
                      newList[index].harga = newHarga;
                      newList[index].total =
                        newList[index].qty_isi * newList[index].coly * newHarga;
                      setBarang(newList);
                    }}
                  />
                </td>
                <td className="p-2 text-right">
                  <Input
                    type="text"
                    value={item.diskon.toFixed(2)}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value.replace(",", "."));
                      const newDiskon = isNaN(value) ? 0 : parseFloat(value.toFixed(2));
                      const newList = [...barang];
                      newList[index].diskon = newDiskon;
                      newList[index].total =
                        newList[index].total -
                        (newList[index].total * newDiskon) / 100;
                      setBarang(newList);
                    }}
                  />
                </td>
                <td className="p-2 text-right">{formatRibuan(item.total)}</td>
                <td className="p-2 flex gap-3" colSpan={2}>
                  <button
                    onClick={() => removeDetail(index)}
                    className="b-delete"
                  >
                    <TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {/* Sticky Input Row */}
            <tr className="sticky bg-white shadow-md border-t uppercase">
              <td className="p-2 text-center">{barang.length + 1}</td>
              <td className="p-2">
                <input
                  className="w-full border px-2 py-1 uppercase"
                  value={formDetail.nama_barang}
                  ref={inputNamaBarang}
                  onChange={(e) =>
                    setFormDetail({
                      ...formDetail,
                      nama_barang: e.target.value,
                    })
                  }
                />
              </td>
              <td className="p-2">
                <div className="flex gap-1">
                  <input
                    type="number"
                    className="w-1/2 border px-2 py-1 uppercase"
                    value={formDetail.coly.toFixed(2)}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      // const raw = +e.target.value.replace(/\D/g, "");
                      const value = parseFloat(e.target.value) || 0;
                      setFormDetail({
                        ...formDetail,
                        coly: value,
                      });
                    }}
                  />
                  <input
                    className="w-1/2 border px-2 py-1 uppercase"
                    value={formDetail.satuan_coly}
                    onChange={(e) =>
                      setFormDetail({
                        ...formDetail,
                        satuan_coly: e.target.value,
                      })
                    }
                  />
                </div>
              </td>
              <td className="p-2">
                <div className="flex gap-1">
                  <input
                    type="number"
                    className="w-1/2 border px-2 py-1"
                    value={formDetail.qty_isi.toFixed(2)}
                    // step={0.00392156863}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFormDetail({
                        ...formDetail,
                        qty_isi: value,
                      });
                    }}
                  />
                  <input
                    className="w-1/2 border px-2 py-1 uppercase"
                    value={formDetail.nama_isi}
                    onChange={(e) =>
                      setFormDetail({ ...formDetail, nama_isi: e.target.value })
                    }
                  />
                </div>
              </td>
              <td className="p-2 text-center">
                {formDetail.coly && formDetail.qty_isi
                  ? formDetail.coly * formDetail.qty_isi
                  : 0}{" "}
                {formDetail.nama_isi}
              </td>
              <td className="p-2">
                <input
                  type="text"
                  className="w-full border px-2 py-1"
                  value={formDetail.harga.toFixed(2)}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    const value = parseFloat(raw) || 0;
                    setFormDetail({
                      ...formDetail,
                      harga: value,
                    });
                  }}
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  className="w-full border px-2 py-1"
                  value={formDetail.diskon}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    const val = parseFloat(raw) || 0;
                    setFormDetail({
                      ...formDetail,
                      diskon: val,
                    });
                  }}
                />
              </td>
              <td className="p-2 text-right">
                {formDetail.harga && formDetail.qty_isi
                  ? formatRibuan(
                      formDetail.harga * formDetail.coly * formDetail.qty_isi -
                        formDetail.harga *
                          formDetail.coly *
                          formDetail.qty_isi *
                          (formDetail.diskon / 100)
                    )
                  : 0}
              </td>
              <td className="p-2 text-center">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={addDetail}
                >
                  Tambah
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="text-right">
              <td colSpan={7}>
                <div className="my-1.5">Subtotal:</div>
              </td>
              <td>{subtotal.toLocaleString("id-ID")}</td>
              <td></td>
            </tr>
            <tr className="text-right">
              <td colSpan={7}>
                <div className="my-1.5">
                  <p>Diskon:</p>
                </div>
              </td>
              <td>
                <div className="flex justify-evenly">
                  <Input
                    className="w-18"
                    value={diskonPersen}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setDiskonPersen(val);
                      setDiskonRupiah((subtotal * val) / 100);
                    }}
                    placeholder="Diskon %"
                    type="number"
                    onFocus={(e) => e.target.select()}
                  />
                  <span>%</span>
                </div>
              </td>
              <td>
                <div className="flex justify-evenly">
                  <span>Rp</span>
                  <Input
                    className="w-25"
                    value={diskonRupiah}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setDiskonRupiah(val);
                      setDiskonPersen((val / subtotal) * 100);
                    }}
                    placeholder="Diskon Rp"
                    type="number"
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              </td>
            </tr>
            <tr className="text-right">
              <td colSpan={7}>
                <div className="my-1.5">Total Harga:</div>
              </td>
              <td>{totalHarga.toLocaleString("id-ID")}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default NotaPage;
