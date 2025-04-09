import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CalendarIcon, PlusIcon, PrinterIcon, SaveIcon } from "lucide-react";
import { format } from "date-fns";
import { useCreateNota } from "@/services/mutations";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const AddAllNota = () => {
  const currentDate = new Date();
  const formattedNoNota = format(currentDate, "yyyyMMddHHmmss");
  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  const { mutate: createNota, isPending } = useCreateNota();

  const { register, handleSubmit, control, watch, setValue, reset } = useForm({
    defaultValues: {
      no_nota: formattedNoNota,
      tanggal: formatDate(new Date()),
      jt_tempo: "",
      pembeli: "",
      alamat: "",
      details: [{ nama_barang: "", coly: "", qty_isi: "", nama_isi: "", harga: "" }],
    },
  });

  const { fields } = useFieldArray({ control, name: "details" });

  const details = watch("details", []);
  const totalColy = details.reduce((sum, d) => sum + (parseInt(d.coly) || 0), 0);
  const totalHarga = details.reduce(
    (sum, d) => sum + (parseInt(d.coly) * parseInt(d.qty_isi) * parseFloat(d.harga) || 0),
    0
  );

  // const onSubmit = (data) => {
  //   const formattedData = {
  //     ...data,
  //     total_harga: totalHarga,
  //     total_coly: totalColy,
  //     details: data.details.map((d) => ({
  //       ...d,
  //       coly: parseInt(d.coly),
  //       qty_isi: parseInt(d.qty_isi),
  //       harga: parseFloat(d.harga),
  //       jumlah: parseInt(d.coly) * parseInt(d.qty_isi),
  //       total: parseInt(d.coly) * parseInt(d.qty_isi) * parseFloat(d.harga),
  //     })),
  //   };

  //   createNota(formattedData);

  //   console.log('payload', formattedData);
    
  // };

    const onSubmit = (data) => {
      if (!barang.length) {
        console.error("Tidak ada barang yang bisa disimpan!");
        return;
      }

      // Gabungkan data nota (dari form) dengan details (dari tabel barang)
      const formattedData = {
        ...data, // Data nota dari form (misal: id, tanggal, customer)
        total_harga: barang.reduce((sum, item) => sum + item.total, 0), // Hitung total harga
        total_coly: barang.reduce((sum, item) => sum + item.coly, 0), // Hitung total coly
        details: barang.map((d) => ({
          nama_barang: d.nama_barang,
          coly: parseInt(d.coly) || 0,
          qty_isi: parseInt(d.qty_isi) || 0,
          nama_isi: d.nama_isi || "",
          harga: parseFloat(d.harga) || 0,
          jumlah: (parseInt(d.coly) || 0) * (parseInt(d.qty_isi) || 0),
          total:
            (parseInt(d.coly) || 0) *
            (parseInt(d.qty_isi) || 0) *
            (parseFloat(d.harga) || 0),
        })),
  };

  // Kirim data ke backend
  // createNota(formattedData);
  createNota(formattedData, {
    onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Nota created successfully!",
              confirmButtonText: "Ok",
            })
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

  // Debugging
  console.log("Payload:", formattedData);
  
  // Reset form setelah submit
   reset({
    ...data, // Biarkan data pembeli, alamat, tanggal, dan jatuh tempo tetap ada
    details: [{ nama_barang: "", coly: 0, qty_isi: 0, nama_isi: "", harga: 0 }],
  });

  setBarang([]); // Kosongkan tabel setelah disimpan
};

  const [barang, setBarang] = useState<
  { nama_barang: string; coly: number; qty_isi: number; nama_isi: string; harga: number; jumlah: number; total: number }[]
>([]);

const addDetail = () => {
  const lastDetail = details[details.length - 1] || {};

  const newItem = {
    nama_barang: lastDetail.nama_barang || "",
    coly: parseInt(lastDetail.coly) || 0,
    qty_isi: parseInt(lastDetail.qty_isi) || 0,
    nama_isi: lastDetail.nama_isi || "",
    jumlah: (parseInt(lastDetail.coly) || 0) * (parseInt(lastDetail.qty_isi) || 0),
    harga: parseFloat(lastDetail.harga) || 0,
    total:
      (parseInt(lastDetail.coly) || 0) * (parseInt(lastDetail.qty_isi) || 0) * (parseFloat(lastDetail.harga) || 0),
  };

  // Tambahkan ke tabel barang
  setBarang((prev) => [...prev, newItem]);

  // Reset form input detail saja
  setValue("details", [
    { nama_barang: "", coly: "", qty_isi: "", nama_isi: "", harga: "" },
  ]);
};


   const columns: ColumnDef<any>[] = [
      {
        id: 'no', 
        header: "No",
        cell: ({ row }) => row.index + 1,
      },
      { accessorKey: "coly", header: "COLY" },
      {
        accessorKey: "isi",
        header: "ISI",
        cell: ({ row }) => `${row.original.qty_isi} ${row.original.nama_isi}`,
      },
      {
        accessorKey: "jumlah",
        header: "JUMLAH",
        cell: ({ row }) => `${row.original.jumlah} ${row.original.nama_isi}`,
        // cell: ({ row }) => {
        //   const { jumlah, nama_isi } = row.original;
        //   return `${jumlah} ${nama_isi}`;
        // },
      },
      { accessorKey: "nama_barang", header: "NAMA BARANG" },
      { accessorKey: "harga", header: "HARGA" },
      { accessorKey: "total", header: "TOTAL" },
      
    ];

    const table = useReactTable({
        data: barang ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
      });

  return (
    <div className="p-6 mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-6">
          <Card className="p-6 col-span-2">
            <h2 className="text-lg font-bold text-center">Nota</h2>
            <div className="flex justify-between">
                <div className="space-y-2">
                    <p>Mentari Jaya Surabaya</p>
                    <div className="flex gap-3">
                    <p>Nota :</p>
                    <Input {...register("no_nota")} className="w-35 text-center" readOnly />
                    </div>

                    <div className="flex gap-2">
                    {/* Tanggal */}
                    <Label>Tanggal</Label>
                    <Popover>
                    <PopoverTrigger asChild  className="bg-white">
                        <Button variant="outline" className="calender">
                        {watch("tanggal") ? format(new Date(watch("tanggal")), "dd MMM yyyy") : "Pilih Tanggal"}
                        <CalendarIcon className="ml-auto h-4 w-4 text-gray-500" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border border-gray-300 shadow-md">
                        <Calendar
                        mode="single"
                        selected={new Date(watch("tanggal"))}
                        onSelect={(date) => setValue("tanggal", formatDate(date))}
                        className="bg-white text-black [&_*]:!bg-white [&_*]:!text-black [&_.day-selected]:!bg-blue-500"
                        />
                    </PopoverContent>
                    </Popover>
                    </div>

                    <div className="flex gap-3">
                    {/* Jatuh Tempo */}
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
                        onSelect={(date) => setValue("jt_tempo", formatDate(date))}
                        className="bg-white text-black [&_*]:!bg-white [&_*]:!text-black [&_.day-selected]:!bg-blue-500"
                        />
                    </PopoverContent>
                    </Popover>
                    {/* <Input type="date" {...register("jt_tempo")} />               */}
                    </div>
                </div>

                <div className="space-y-2">
                    <p>Kepada Yth</p>
                    <Input {...register("pembeli")} placeholder="Masukkan Nama Pembeli" />
                    <Input {...register("alamat")} placeholder="Masukkan Alamat" />
                    <div className="flex items-end gap-2 mt-15">
                        <Button className="flex items-center gap-2">
                        <PrinterIcon size={16} /> Print
                        </Button>
                        <Button type="submit" className="flex items-center gap-2" disabled={isPending}>
                        <SaveIcon size={16} /> {isPending ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>
            </div>

            <Table className="mb-2">
                <TableHeader className="bg-neutral-200">
                    <TableRow>
                    {table.getHeaderGroups().map((headerGroup) =>
                        headerGroup.headers.map((header) => (
                        <TableCell key={header.id}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableCell>
                        ))
                    )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={6}>Total</TableCell>
                    <TableCell className="text-right">{totalHarga}</TableCell>
                  </TableRow>
                </TableFooter>
                </Table>
          </Card>


          <Card className="p-6 max-w-md">
            <h2 className="text-lg font-bold text-center">Tambah Detail Barang</h2>

            {fields.map((field, index) => (
            <div key={field.id} className="space-y-2">
                <div className="flex gap-14">
                <p>Barang</p>
                    <Input {...register(`details.${index}.nama_barang`)} placeholder="Nama Barang" className="w-70" />
                </div>

                <div className="flex gap-19">
                <p>Coly</p>
                    <Input type="number" {...register(`details.${index}.coly`)} placeholder="Coly" className="w-96" />
                </div>

                <div className="flex gap-20">
                <p>Qty</p>
                    <div className="flex gap-2">
                        <Input type="number" {...register(`details.${index}.qty_isi`)} placeholder="Qty" />
                        <Input {...register(`details.${index}.nama_isi`)} placeholder="Nama Isi" />
                    </div>
                </div>

                <div className="flex gap-16">
                <p>Harga</p>
                    <Input type="number" {...register(`details.${index}.harga`)} placeholder="Harga" className="w-96" />
                </div>
              {/* <Button type="button" onClick={() => remove(index)}>Hapus</Button> */}
            </div>
            
          ))}
            <div className="flex flex-col items-end mt-4 space-y-2">
              <Button type="button" onClick={addDetail} className="flex items-center gap-2" disabled={barang.length >= 10}>
                <PlusIcon size={16} /> Add
              </Button>
              {barang.length >= 10 && (
                <p className="text-red-500 text-sm">*Barang sudah mencapai batas maksimum</p>
              )}
            </div>
          </Card>

          </div>

        </form>
    </div>
  );
};

export default AddAllNota;
