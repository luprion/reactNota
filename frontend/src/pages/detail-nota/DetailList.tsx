import { useParams } from "react-router-dom";
import { useGetDetailNota, useGetAllNota  } from "@/services/queries";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteDetailNota } from "@/services/mutations";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const DetailNota = () => {
  const { notaId } = useParams();
  const { data: nota } = useGetAllNota();
  const { data: details, refetch } = useGetDetailNota(notaId);
  const deleteDetail = useDeleteDetailNota();

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Detail Nota", 
  });

  // Menghitung total jumlah
  const totalJumlah = details?.reduce((sum, detail) => sum + detail.jumlah, 0) || 0;

  const columns: ColumnDef<any>[] = [
    { accessorKey: "coly", header: "COLY" },
    { accessorKey: "qty_isi", header: "ISI" },
    { accessorKey: "nama_barang", header: "NAMA BARANG" },
    { accessorKey: "harga", header: "HARGA" },
    { accessorKey: "jumlah", header: "JUMLAH" },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          onClick={() => handleDeleteDetail(row.original.id)}
        >
          Hapus
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: details ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDeleteDetail = async (detailId: string) => {
    await deleteDetail.mutateAsync(detailId);
    refetch();
  };

  return (
    <div>
        <Button className="no-print mb-4" onClick={() => handlePrint()}>Print Nota</Button>
        <div ref={printRef} id="print-area">
            <Card className="p-4">
      <CardHeader>
        <CardTitle>Detail Nota</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div>
            <p>Surabaya, {nota?.tanggal}</p>
            <p>Tuan: {nota?.tuan}</p>
          </div>
          <div>
            <p>No Nota: {nota?.id}</p>
          </div>
        </div>

        <Table>
          <TableCaption>List Detail Nota</TableCaption>
          <TableHeader>
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
        </Table>

        <div className="flex justify-between mt-4">
          <p className="font-bold">JUMLAH Rp. {totalJumlah.toLocaleString()}</p>
          <Button
            onClick={() => console.log("Tambah Detail")}
            disabled={(details?.length ?? 0) >= 10}
          >
            Tambah Detail
          </Button>
        </div>
      </CardContent>
    </Card>
        </div>
    </div>
    
  );
};

export default DetailNota;
