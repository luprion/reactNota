import { useGetAllNota } from '@/services/queries'
import { Nota } from '@/types/nota';
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import React, { useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, PlusIcon, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useDeleteDetailNota } from '@/services/mutations';
import { useQueryClient } from '@tanstack/react-query';

const NotaList = () => {
    const { data } = useGetAllNota();
    const queryClient = useQueryClient();
    const { mutate: deleteDetail } = useDeleteDetailNota();
    const navigate = useNavigate();
    const [sorting, setSorting] = useState<SortingState>([]);
    const renderDate = (dateString: string) => {
        if (!dateString) return "Unknown Date";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.toLocaleString("en-US", { month: "long" });
        const day = String(date.getDate()).padStart(2, "0");
      
        return `${day} ${month} ${year}`;
      };

    const handleNavigate = (id: number) => {
        navigate(`/${id}/generate-nota`)
    }

    const handleDelete = (id: number) => {
    Swal.fire({
        title: "Yakin ingin menghapus data ini?",
        text: "Data akan disembunyikan (status = 0)",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
    }).then((result) => {
        if (result.isConfirmed) {
        deleteDetail(id, {
            onSuccess: () => {
            Swal.fire("Berhasil!", "Data telah dihapus.", "success");
            queryClient.invalidateQueries({queryKey: ["nota"]})
            }, 
            onError: () => {
            Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
            },
        });
        }
    });
    };

    const columns = React.useMemo<ColumnDef<Nota>[]>(() => [
        { accessorKey: "id", header: "No" },
        { accessorKey: "pembeli", header: "Pembeli" },
        { accessorFn: (row) => renderDate(row.tanggal), header: "Tanggal" },
        { accessorKey: "status", header: "Status" },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <ToggleGroup type='single' className=' gap-2 '>
                    <ToggleGroupItem value='lihat' className='toggle-lihat' onClick={() => handleNavigate(row.original.id!)}>
                       <EyeIcon/> Lihat Detail  
                    </ToggleGroupItem>
                    <ToggleGroupItem value='delete' className='toggle-delete' onClick={() => handleDelete(row.original.id!)}> <Trash2/> Delete</ToggleGroupItem>
                </ToggleGroup>
            )
        }
    ], []);

    const sortedData = React.useMemo(() => {
    if (!data) return [];

    return [...data].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    }, [data]);

    const table = useReactTable({
        data: sortedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { sorting },
        onSortingChange: setSorting,
    });

    return (
        <div className="container mx-auto max-w-5xl p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Daftar Nota</h1>

            {/* Tombol Tambah Nota */}
            <div className="flex justify-end mb-4">
                <Button onClick={() => navigate('/tambah-nota')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                    <PlusIcon/>Tambah Nota
                </Button>
            </div>

            {/* Tabel Nota */}
            <div className="overflow-x-auto">
                <Table className="w-full border border-gray-200 rounded-md">
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            {table.getHeaderGroups().map((headerGroup) =>
                                headerGroup.headers.map((header) => (
                                    <TableCell key={header.id} colSpan={header.colSpan} className="p-2 font-semibold text-center">
                                        {header.isPlaceholder ? null : (
                                            <div {...{
                                                onClick: header.column.getToggleSortingHandler(),
                                                style: { cursor: "pointer", display: "flex", justifyContent: "center" },
                                            }}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() === "asc" ? <span> 🔼</span> : null}
                                                {header.column.getIsSorted() === "desc" ? <span> 🔽</span> : null}
                                            </div>
                                        )}
                                    </TableCell>
                                ))
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-gray-50 transition-all">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="p-3 text-center">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-4">
                                    Tidak ada data tersedia.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default NotaList;
