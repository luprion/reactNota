import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CalendarIcon, PlusIcon, SaveIcon } from "lucide-react";
import { addMonths, format } from "date-fns";
import { useCreateNota } from "@/services/mutations";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { NotaPayload } from "@/types/nota";

export type NotaFormData = {
  no_nota: string;
  tanggal: string;
  jt_tempo: string;
  pembeli: string;
  alamat: string;
  details: {
    nama_barang: string;
    coly: string;
    satuan_coly: string;
    qty_isi: string;
    nama_isi: string;
    harga: string;
    diskon: string;
  }[];
};

const AddAllNota = () => {
  const currentDate = new Date();
  const formattedNoNota = format(currentDate, "yyyyMMddHHmmss");
  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");
  const tanggal = new Date();
  const tempo = addMonths(tanggal, 2)

  const { mutate: createNota, isPending } = useCreateNota();

  const { register, handleSubmit, control, watch, setValue, reset } = useForm({
    defaultValues: {
      no_nota: formattedNoNota,
      tanggal: formatDate(tanggal),
      jt_tempo: formatDate(tempo),
      pembeli: "",
      alamat: "",
      details: [{ nama_barang: "", coly: "", satuan_coly: "", qty_isi: "", nama_isi: "", harga: "", diskon: "" }],
    },
  });

  const { fields } = useFieldArray({ control, name: "details" });

  const details = watch("details", []);

  const [diskonPersen, setDiskonPersen] = useState(0);
  const [diskonRupiah, setDiskonRupiah] = useState(0);

  const handleDiskonChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "persen" | "rupiah"
      ) => {
        const value = parseFloat(e.target.value) || 0;

        if (type === "persen") {
          const rupiah = (totalHarga * value) / 100;
          setDiskonPersen(value);
          setDiskonRupiah(rupiah);
        } else {
          const persen = (value / totalHarga) * 100;
          setDiskonRupiah(value);
          setDiskonPersen(persen);
        }
  };

  // const onSubmit = (data) => {
  //     if (!barang.length) {
  //       console.error("Tidak ada barang yang bisa disimpan!");
  //       return;
  //     }

  //     const subtotal = barang.reduce((sum, item) => sum + item.total, 0); // total sebelum diskon
  //     const total_harga = subtotal - diskonRupiah;
  //     const total_coly = barang.reduce((sum, item) => sum + item.coly, 0);

  //     // Gabungkan data nota (dari form) dengan details (dari tabel barang)
  //     const formattedData = {
  //       ...data, // Data nota dari form (misal: id, tanggal, customer)
  //       subtotal,
  //       diskon_persen: diskonPersen,
  //       diskon_rupiah: diskonRupiah,
  //       total_harga, 
  //       total_coly,
  //       details: barang.map((d) => ({
  //         nama_barang: d.nama_barang,
  //         coly: parseInt(d.coly) || 0,
  //         satuan_coly: d.satuan_coly || "",
  //         qty_isi: parseInt(d.qty_isi) || 0,
  //         nama_isi: d.nama_isi || "",
  //         harga: parseFloat(d.harga) || 0,
  //         diskon: parseFloat(d.diskon) || 0,
  //         jumlah: (parseInt(d.coly) || 0) * (parseInt(d.qty_isi) || 0),
  //         total:
  //          ( (parseInt(d.coly) || 0) *
  //           (parseInt(d.qty_isi) || 0) *
  //           (parseFloat(d.harga) || 0)) * (1- (parseFloat(d.diskon) || 0) / 100),
  //       })),
  //     };

  //     // Kirim data ke backend
  //     // createNota(formattedData);
  //     createNota(formattedData, {
  //       onSuccess: (data) => {
  //         console.log("response backend", data);
  //         const notaId = data.payload.datas.nota_id;
  //               Swal.fire({
  //                 icon: "success",
  //                 title: "Success!",
  //                 text: "Nota created successfully!",
  //                 confirmButtonText: "Ok",
  //               }).then((result) => {
  //                 if (result.isConfirmed) {
  //                   // Buka halaman preview/print di tab baru
  //                   window.open(`/${notaId}/generate-nota`, "_blank");
  //                 }
  //               });
  //             },
  //             onError: (error) => {
  //               if (axios.isAxiosError(error)) {
  //                 Swal.fire({
  //                   icon: "error",
  //                   title: "Failed!",
  //                   text: error.response?.data,
  //                   confirmButtonText: "Ok",
  //                 });
  //               }
  //             },
  //     });

  //     // Debugging
  //     console.log("Payload:", formattedData);
      
      
  //     // Reset form setelah submit
  //     reset({
  //       ...data, // Biarkan data pembeli, alamat, tanggal, dan jatuh tempo tetap ada
  //       details: [{ nama_barang: "", coly: 0, satuan_coly: "", qty_isi: 0, nama_isi: "", harga: 0 }],
  //     });

  //     setBarang([]); // Kosongkan tabel setelah disimpan
  //     setDiskonPersen(0);
  //     setDiskonRupiah(0);
  // };

  const onSubmit = (data: NotaFormData) => {
  if (!barang.length) {
    console.error("Tidak ada barang yang bisa disimpan!");
    return;
  }

  const subtotal = barang.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const total_harga = subtotal - diskonRupiah;
  const total_coly = barang.reduce((sum, item) => sum + Number(item.coly || 0), 0);

  const formattedData: NotaPayload = {
    ...data,
    subtotal,
    diskon_persen: diskonPersen,
    diskon_rupiah: diskonRupiah,
    total_harga,
    total_coly,
    details: barang.map((d) => {
      const coly = Number(d.coly) || 0;
      const qty_isi = Number(d.qty_isi) || 0;
      const harga = Number(d.harga) || 0;
      const diskon = Number(d.diskon) || 0;

      const jumlah = coly * qty_isi;
      const total = jumlah * harga * (1 - diskon / 100);

      return {
        nama_barang: d.nama_barang,
        coly,
        satuan_coly: d.satuan_coly,
        qty_isi,
        nama_isi: d.nama_isi,
        harga,
        diskon,
        jumlah,
        total,
      };
    }),
  };

  createNota(formattedData, {
    onSuccess: (data) => {
      const notaId = data.payload.datas.nota_id;
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Nota created successfully!",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          window.open(`/${notaId}/generate-nota`, "_blank");
        }
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: error.response?.data,
          confirmButtonText: "Ok",
        });
      }
    },
  });

  console.log("Payload:", formattedData);

  reset({
    ...data,
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



  const [barang, setBarang] = useState<
    { nama_barang: string; coly: number; satuan_coly: string; qty_isi: number; nama_isi: string; harga: number; jumlah: number; total: number; diskon: number; }[]
  >([]);

  const subtotal = barang.reduce((sum, item) => sum + item.total, 0);

  const totalHarga = subtotal - diskonRupiah;

  const addDetail = () => {
    const lastDetail = details[details.length - 1] || {};

    const newItem = {
      nama_barang: lastDetail.nama_barang || "",
      coly: parseInt(lastDetail.coly) || 0,
      satuan_coly: lastDetail.satuan_coly || "",
      qty_isi: parseInt(lastDetail.qty_isi) || 0,
      nama_isi: lastDetail.nama_isi || "", 
      jumlah: (parseInt(lastDetail.coly) || 0) * (parseInt(lastDetail.qty_isi) || 0),
      harga: parseFloat(lastDetail.harga) || 0,
      diskon: parseFloat(lastDetail.diskon) || 0,
      total:
        ((parseInt(lastDetail.coly) || 0) *
        (parseInt(lastDetail.qty_isi) || 0) *
        (parseFloat(lastDetail.harga) || 0)) *
      (1 - (parseFloat(lastDetail.diskon) || 0) / 100)
    };

    // Tambahkan ke tabel barang
    setBarang((prev) => [...prev, newItem]);

    // Reset form input detail saja
    setValue("details", [
      { nama_barang: "", coly: "",  satuan_coly: "", qty_isi: "", nama_isi: "", harga: "", diskon: "" },
    ]);
  };

  const handleDelete = (index: number) => {
    setBarang((prevBarang) => prevBarang.filter((_, i) => i !== index));
  };

  const columns: ColumnDef<any>[] = [
      {
        id: 'no', 
        header: "No",
        cell: ({ row }) => row.index + 1,
      },
      { accessorKey: "nama_barang", header: "NAMA BARANG", meta: { width: "400px" }  },
      { accessorKey: "coly", 
        header: "COLY",
        cell: ({row}) => `${row.original.coly} ${row.original.satuan_coly}`
      },
      {
        accessorKey: "isi",
        header: "ISI",
        cell: ({ row }) => `${row.original.qty_isi} ${row.original.nama_isi}`,
      },
      {
        accessorKey: "jumlah",
        header: "TOTAL QTY",
        cell: ({ row }) => `${row.original.jumlah} ${row.original.nama_isi}`,

      },
      {  accessorKey: "harga",
      header: "HARGA",
      cell: ({ row }) => {
        const harga = row.original.harga;
        return `${harga.toLocaleString("id-ID")}`;
      }},
      { accessorKey: "diskon", 
        header: "% DISC",
      },
      { accessorKey: "total",
      header: "SUBTOTAL",
      meta: { width: "10px" },
      cell: ({ row }) => {
        const totalHarga = row.original.total;
        return `${totalHarga.toLocaleString("id-ID")}`;
      } },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <button
            onClick={() => handleDelete(row.index)}
            className="b-delete"
          >
            Delete
          </button>
        ),
      },
      
  ];

  const table = useReactTable({
        data: barang ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6 mx-auto">
  <form onSubmit={handleSubmit(onSubmit)}>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-6 col-span-2">
        <h2 className="text-lg font-bold text-center">Nota</h2>
        <div className="flex flex-col lg:flex-row justify-between gap-y-4">
          <div className="space-y-2 w-full">
            <p>Mentari Jaya Surabaya</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <p>Nota :</p>
              <Input {...register("no_nota")} className="w-35 text-center" readOnly />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Label>Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild className="bg-white">
                  <Button variant="outline" className="calender">
                    {watch("tanggal") ? format(new Date(watch("tanggal")), "dd MMM yyyy") : "Pilih Tanggal"}
                    <CalendarIcon className="ml-auto h-4 w-4 text-gray-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border border-gray-300 shadow-md">
                  <Calendar
                    mode="single"
                    selected={new Date(watch("tanggal"))}
                    onSelect={(date) => setValue("tanggal", date ? formatDate(date): "")}
                    className="bg-white text-black [&_*]:!bg-white [&_*]:!text-black [&_.day-selected]:!bg-blue-500"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Label>Tempo</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="calender">
                    {watch("jt_tempo") ? format(new Date(watch("jt_tempo")), "dd MMM yyyy") : "Jatuh Tempo"}
                    <CalendarIcon className="ml-auto h-4 w-4 text-gray-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border border-gray-300 shadow-md">
                  <Calendar
                    mode="single"
                    selected={watch("jt_tempo") ? new Date(watch("jt_tempo")) : undefined}
                    onSelect={(date) => setValue("jt_tempo", date ? formatDate(date) : "")}
                    className="bg-white text-black [&_*]:!bg-white [&_*]:!text-black [&_.day-selected]:!bg-blue-500"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2 w-full">
            <p>Kepada Yth</p>
            <Input {...register("pembeli")} placeholder="Masukkan Nama Pembeli" />
            <Input {...register("alamat")} placeholder="Masukkan Alamat" />
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 mt-4">
              {/* <Button className="flex items-center gap-2">
                <PrinterIcon size={16} /> Print
              </Button> */}
              <Button type="submit" className="flex items-center gap-2" disabled={isPending}>
                <SaveIcon size={16} /> {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        <Table className="mb-2 t-table mt-6">
          <TableHeader className="bg-neutral-200">
            <TableRow>
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => {
                  const width = (header.column.columnDef.meta as { width?: string })?.width;
                  return (
                    <TableCell key={header.id} style={{ width }}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  );
                })
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  // const width = cell.column.columnDef.meta?.width;
                  const width = (cell.column.columnDef.meta as { width?: string })?.width;
                  return (
                    <TableCell key={cell.id} style={{ width }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-right"></TableCell>
              <TableCell className="text-left">
                <div className="flex flex-col sm:flex-row items-start text-sm sm:items-end">
                  <span>Diskon : </span>
                  <Input
                    type="number"
                    value={diskonPersen}
                    onChange={(e) => handleDiskonChange(e, "persen")}
                    placeholder="%"
                    className="w-20 text-right"
                  />
                  <span className="ml-1 py-1 bg-gray-200 rounded text-sm"> %</span>
                </div>
              </TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right ml-20">
                <div className="flex flex-col sm:flex-row items-start sm:items-end">
                  <span className="ml-1 py-1 bg-gray-200 rounded text-sm">Rp.</span>
                  <Input
                    type="number"
                    value={diskonRupiah}
                    onChange={(e) => handleDiskonChange(e, "rupiah")}
                    placeholder="Rp"
                    className="w-28 text-right"
                  />
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={8} className="text-right text-sm">Subtotal :</TableCell>
              <TableCell className="text-left text-sm">
                Rp. {subtotal.toLocaleString("id-ID")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={8} className="text-right text-sm">Total :</TableCell>
              <TableCell className="text-left text-sm">
                Rp. {totalHarga.toLocaleString("id-ID")}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>

      <Card className="p-6 max-w-md w-full">
        <h2 className="text-lg font-bold text-center">Tambah Detail Barang</h2>

        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-4">
              <p>Barang</p>
              <Input {...register(`details.${index}.nama_barang`)} placeholder="Nama Barang" className="w-full" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <p>Coly</p>
              <div className="flex gap-2 w-full">
                <Input type="number" {...register(`details.${index}.coly`)} placeholder="Coly" className="w-1/2" />
                <Input {...register(`details.${index}.satuan_coly`)} placeholder="Satuan Coly" className="w-1/2" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <p>Qty</p>
              <div className="flex gap-2">
                <Input type="number" {...register(`details.${index}.qty_isi`)} placeholder="Qty" className="w-1/2" />
                <Input {...register(`details.${index}.nama_isi`)} placeholder="Nama Isi" className="w-1/2" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <p>Harga</p>
              <Input type="number" {...register(`details.${index}.harga`)} placeholder="Harga" className="w-full" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <p>Diskon</p>
              <Input defaultValue={0} type="number" {...register(`details.${index}.diskon`)} placeholder="0" className="w-full" />
              <p className="tBold">%</p>
            </div>
          </div>
        ))}

        <div className="flex flex-col items-end mt-4 space-y-2">
          <Button type="button" onClick={addDetail} className="flex items-center gap-2">
            <PlusIcon size={16} /> Add
          </Button>
        </div>
      </Card>
    </div>
  </form>
</div>

  );
};

export default AddAllNota;
