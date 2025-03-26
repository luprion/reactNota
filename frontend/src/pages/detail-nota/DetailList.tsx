import { useNavigate, useParams } from "react-router-dom";
import { useGetDetailNota, useGetAllNota  } from "@/services/queries";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteDetailNota } from "@/services/mutations";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import AddDetailPage from "./AddDetail";

const DetailNota = () => {
  const { notaId } = useParams();
  const { data: notaList } = useGetAllNota();
  const nota = notaList?.find((nota) => nota.id === Number(notaId));
  console.log(nota, "si nnota");
  
  const { data: details, refetch } = useGetDetailNota(notaId);
  const deleteDetail = useDeleteDetailNota();
  const navigate = useNavigate();

  const renderDate = (dateString: string) => {
        if (!dateString) return "Unknown Date";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.toLocaleString("en-US", { month: "long" });
        const day = String(date.getDate()).padStart(2, "0");
      
        return `${day} ${month} ${year}`;
  };

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Detail Nota", 
  });

  // Menghitung total jumlah
  const totalJumlah = details?.reduce((sum, detail) => sum + detail.jumlah, 0) || 0;

  const columns: ColumnDef<any>[] = [
    {accessorKey: "id", header: "No"},
    { accessorKey: "coly", header: "COLY" },
    {
      accessorKey: "isi",
      header: "ISI",
      cell: ({ row }) => {
        const { qty_isi, nama_isi } = row.original;
        return `${qty_isi} ${nama_isi}`;
      },
    },
    {
      accessorKey: "jumlah",
      header: "JUMLAH",
      cell: ({ row }) => {
        const { jumlah, nama_isi } = row.original;
        return `${jumlah} ${nama_isi}`;
      },
    },
    { accessorKey: "nama_barang", header: "NAMA BARANG" },
    { accessorKey: "harga", header: "HARGA" },
    { accessorKey: "total", header: "TOTAL" },
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
    <div className="container place-content-center">
      <AddDetailPage/>
        <Button className="no-print mb-4" onClick={() => handlePrint()}>Print Nota</Button>
        <div ref={printRef} id="print-area">
            <Card className="p-4">
      <CardHeader>
        <CardTitle>Detail Nota</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4 gap-2">
          <div>
            {nota && <p>Surabaya, {renderDate(nota?.tanggal)}</p>}
            <p>Pembeli: {nota?.pembeli}</p>
          </div>
          <div>
            <p>No Nota: {nota?.no_nota}</p>
            <p>Alamat: {nota?.alamat}</p>
          </div>
        </div>

        <Table className="mb-2">
          <TableHeader className="bg-neutral-700">
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
            onClick={() => navigate(`/nota/${notaId}/add-detail-nota`)}
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
