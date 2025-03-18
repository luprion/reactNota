import { useGetAllNota } from '@/services/queries'
import { Nota } from '@/types/nota';
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
// import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Table, TableBody, TableCaption, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';

const NotaList: React.FC = () => {
    const {data} = useGetAllNota();
    const { notaId } = useParams();
    const navigate = useNavigate();

    const handleNavigate = (id: number) => {
        navigate(`/nota/${id}/detail-nota`)
    }


    console.log("manaa datanya",data);
    
    const [sorting, setSorting] = useState<SortingState>([]);
    // const queryClient = useQueryClient();

    const columns = React.useMemo<ColumnDef<Nota>[]>(
        () => [
            {
                accessorKey: "id",
                header: "No"
            },
            {
                accessorKey: "tanggal",
                header: "Tanggal"
            }, 
            {
                accessorKey: "status",
                header: "Status"
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({row}) => (
                    <ToggleGroup type='single'>
                        <ToggleGroupItem value='Lihat Detail' onClick={() => handleNavigate(row.original.id)}>Lihat Detail</ToggleGroupItem>
                        <ToggleGroupItem value='edit'>Edit</ToggleGroupItem>
                        <ToggleGroupItem value='delete'>Delete</ToggleGroupItem>
                    </ToggleGroup>
                )
            }
        ]
    ) 

    const table = useReactTable({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting,
        },
        onSortingChange: setSorting,
      });

  return (
    <>
    <Button onClick={() => navigate('/tambah-nota')}>Tambah Nota</Button>
            <Table>
            <TableCaption>List Nota </TableCaption>
            <TableHeader>
                <TableRow>
                    {table.getHeaderGroups().map((headerGroup) => 
                    headerGroup.headers.map((header) => (
                        <TableCell key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder ? null : (
                      <div
                        {...{
                          onClick: header.column.getToggleSortingHandler(),
                          style: { cursor: "pointer", display: "flex" },
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc" ? (
                          <p>^</p>
                        ) : null}
                        {header.column.getIsSorted() === "desc" ? (
                          <p>v</p>
                        ) : null}
                      </div>
                    )}
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
    </>
  )
}

export default NotaList