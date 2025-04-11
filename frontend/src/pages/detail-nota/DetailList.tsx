import { useParams } from "react-router-dom";
import { useGetDetailNota, useGetAllNota  } from "@/services/queries";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableRow } from "@/components/ui/table";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
 
const DetailNota = () => {
  const { notaId } = useParams();
  const { data: notaList } = useGetAllNota();
  const nota = notaList?.find((nota) => nota.id === Number(notaId));
  console.log(nota, "si nnota");
  
  const { data: details,  } = useGetDetailNota(notaId);

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

  const columns: ColumnDef<any>[] = [
    {id: 'no', 
        header: "No",
        cell: ({ row }) => row.index + 1,},
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
    { accessorKey: "diskon", header: "DISC" },
    { accessorKey: "total", header: "TOTAL" },
    // {
    //   id: "actions",
    //   header: "Aksi",
    //   cell: ({ row }) => (
    //     <Button
    //       variant="destructive"
    //       onClick={() => handleDeleteDetail(row.original.id)}
    //     >
    //       Hapus
    //     </Button>
    //   ),
    // },
  ];

  const table = useReactTable({
    data: details ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container place-content-center mx-auto px-6 py-8">
        <Button className="no-print mb-4" onClick={() => handlePrint()}>Print Nota</Button>
        <div ref={printRef} id="print-area">

        <div className="flex justify-between mb-4 gap-2 mx-5">
          <div>
            {nota && <p className="t-bold" >Surabaya, {renderDate(nota?.tanggal)}</p>}
            <p className="t-bold">Pembeli: {nota?.pembeli}</p>
          </div>
          <div>
            <p className="t-bold">No Nota: {nota?.no_nota}</p>
            <p className="t-bold">Alamat: {nota?.alamat}</p>
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
              <TableCell colSpan={7}>Total</TableCell>
             <TableCell className="mr-32 font-bold">Rp. {nota?.total_harga}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        </div>
    </div>
    
  );
};

export default DetailNota;


// import { useParams } from "react-router-dom";
// import { useGetDetailNota, useGetAllNota } from "@/services/queries";
// import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableFooter, TableHeader, TableRow } from "@/components/ui/table";
// import { useRef } from "react";
// import { useReactToPrint } from "react-to-print";

// const DetailNota = () => {
//   const { notaId } = useParams();
//   const { data: notaList } = useGetAllNota();
//   const nota = notaList?.find((nota) => nota.id === Number(notaId));
//   console.log(nota, "si nnota");
  
//   const { data: details } = useGetDetailNota(notaId);

//   const renderDate = (dateString: string) => {
//     if (!dateString) return "Unknown Date";
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = date.toLocaleString("en-US", { month: "long" });
//     const day = String(date.getDate()).padStart(2, "0");
  
//     return `${day} ${month} ${year}`;
//   };

//  const printRef = useRef<HTMLDivElement>(null);
//   const handlePrint = useReactToPrint({
//     contentRef: printRef,
//     documentTitle: "Detail Nota", 
//   });


//   // Batas maksimal 10 barang per halaman
//   const MAX_ITEM_PERPAGE = 10;

//   // Fungsi pembantu untuk membagi array ke dalam chunk dengan ukuran tertentu.
//   const chunkArray = (array: any[], size: number) => {
//     const result = [];
//     for (let i = 0; i < array.length; i += size) {
//       result.push(array.slice(i, i + size));
//     }
//     return result;
//   };

//   // Bagi data details menjadi beberapa halaman (chunk) jika ada lebih dari 10 item
//   const detailPages = chunkArray(details ?? [], MAX_ITEM_PERPAGE);

//   // Definisikan kolom untuk menampilkan data
//   const columns: ColumnDef<any>[] = [
//     {
//       id: 'no', 
//       header: "No",
//       cell: ({ row }) => row.getIndex() + 1,
//     },
//     { accessorKey: "coly", header: "COLY" },
//     {
//       accessorKey: "isi",
//       header: "ISI",
//       cell: ({ row }) => {
//         const { qty_isi, nama_isi } = row.original;
//         return `${qty_isi} ${nama_isi}`;
//       },
//     },
//     {
//       accessorKey: "jumlah",
//       header: "JUMLAH",
//       cell: ({ row }) => {
//         const { jumlah, nama_isi } = row.original;
//         return `${jumlah} ${nama_isi}`;
//       },
//     },
//     { accessorKey: "nama_barang", header: "NAMA BARANG" },
//     { accessorKey: "harga", header: "HARGA" },
//     { accessorKey: "total", header: "TOTAL" },
//   ];
  
//   return (
//     <div className="container place-content-center">
//       <Button className="no-print mb-4" onClick={() => handlePrint()}>Print Nota</Button>
//       <div ref={printRef} id="print-area" className="print-area a6-landscape">
//         {detailPages.map((page, pageIndex) => (
//           <div key={pageIndex} className={pageIndex < detailPages.length - 1 ? "page-break" : ""}>
//             {/* Header Nota */}
//             <div className="flex justify-between mb-4 gap-2 mx-5">
//               <div>
//                 {nota && <p className="t-bold">Surabaya, {renderDate(nota.tanggal)}</p>}
//                 <p className="t-bold">Pembeli: {nota?.pembeli}</p>
//               </div>
//               <div>
//                 <p className="t-bold">No Nota: {nota?.no_nota}</p>
//                 <p className="t-bold">Alamat: {nota?.alamat}</p>
//               </div>
//             </div>

//             {/* Tabel Detail Barang */}
//             <Table className="mb-2">
//               <TableHeader className="bg-neutral-200">
//                 <TableRow>
//                   {columns.map((col, colIdx) => (
//                     <TableCell key={colIdx}>
//                       {col.header}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {page.map((rowData, rowIndex) => (
//                   <TableRow key={rowIndex}>
//                     {columns.map((col, colIdx) => {
//                       let cellValue = "";
//                       if (col.id === "no") {
//                         cellValue = pageIndex * MAX_ITEM_PERPAGE + rowIndex + 1;
//                       } else if ("accessorKey" in col && typeof col.accessorKey === "string") {
//                         cellValue = rowData[col.accessorKey];
//                       } else if (col.cell) {
//                         cellValue = flexRender(col.cell, { row: { original: rowData, index: rowIndex } });
//                       }
//                       return <TableCell key={colIdx}>{cellValue}</TableCell>;
//                     })}
//                   </TableRow>
//                 ))}
//               </TableBody>
//               {pageIndex === detailPages.length - 1 && (
//                 <TableFooter>
//                   <TableRow>
//                     <TableCell colSpan={6}>Total</TableCell>
//                     <TableCell className="mr-32 font-bold">Rp. {nota?.total_harga}</TableCell>
//                   </TableRow>
//                 </TableFooter>
//               )}
//             </Table>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DetailNota;
