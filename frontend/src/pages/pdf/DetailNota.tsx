import { data, useParams } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  SaveIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { addMonths, format } from "date-fns";
import { styles } from "./style";
import { useGetAllNota, useGetDetailNota } from "@/services/queries";
import { useDeleteDetailNota, useUpdateNota } from "@/services/mutations";
import { Table as Tabel, TR, TH, TD } from "@ag-media/react-pdf-table";
import { Nota } from "@/types/nota";
import { DetailNota as NotaDetail } from "@/types/detailNota";
import MartianMonoMedium from "@/assets/font/NotoSans-Medium.ttf";
import MartianMonoBold from "@/assets/font/NotoSans-Bold.ttf";
import { Document, Page, View, Text, pdf, Font } from "@react-pdf/renderer";
import Swal from "sweetalert2";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import AddDetailModal from "./ModalAddDetail";

Font.register({
  family: "MartianMono",
  fonts: [
    { src: MartianMonoBold, fontWeight: "bold" },
    { src: MartianMonoMedium },
  ],
});
const MAX_ITEM_PER_PAGE = 11;

interface NotaPDFProps {
  nota: Nota;
  detailPages: NotaDetail[][];
  styles: any;
}

const NotaPDF: React.FC<NotaPDFProps> = ({ nota, detailPages, styles }) => {
  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.getMonth();
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const columns = [
    {
      label: "No",
      styling: { justifyContent: "flex-start" },
      width: "5%",
      // stylingTD: { fontWeight: "bold" },
      render: (_item: any, index: number, pageIndex: number) =>
        pageIndex * MAX_ITEM_PER_PAGE + index + 1,
    },
    {
      label: "NAMA BARANG",
      styling: { justifyContent: "flex-start" },
      // stylingTD: { fontWeight: "bold" },
      width: "25%",
      key: "nama_barang",
    },
    {
      label: "COLY",
      width: "15%",
      styling: { justifyContent: "flex-start", paddingLeft: "18px" },
      // stylingTD: { fontWeight: "bold" },
      render: (item: any) => (
        <View style={{ flexDirection: "row", width: "100%" }}>
          <Text style={{ width: 6, textAlign: "right" }}>{item.coly}</Text>
          <Text style={{ marginLeft: 2 }}>{item.satuan_coly}</Text>
        </View>
      ),
    },
    {
      label: "ISI",
      width: "15%",
      styling: { justifyContent: "flex-start", paddingLeft: "18px" },
      // stylingTD: { fontWeight: "bold" },
      render: (item: any) => (
        <View style={{ flexDirection: "row", width: "100%" }}>
          {/* <Text style={{ width: 5, textAlign: "right" }}>@ </Text> */}
          <Text style={{ width: 15, textAlign: "right" }}>{item.qty_isi}</Text>
          <Text style={{ marginLeft: 2 }}>{item.nama_isi}</Text>
        </View>
      ),
    },
    {
      label: "TOTAL QTY",
      width: "15%",
      styling: { justifyContent: "flex-start" },
      // stylingTD: { fontWeight: "bold" },
      render: (item: any) => (
        <View style={{ flexDirection: "row", width: "100%" }}>
          <Text style={{ width: 22, textAlign: "right" }}>{item.jumlah}</Text>
          <Text style={{ marginLeft: 2 }}> {item.nama_isi}</Text>
        </View>
      ),
    },
    {
      label: "HARGA",
      width: "10%",
      styling: { justifyContent: "flex-end", paddingRight: "8px" },
      // stylingTD: { fontWeight: "bold" },
      render: (item: any) => (
        <View style={{ flexDirection: "row" }}>
          <Text style={{ width: "100%", textAlign: "right" }}>
            {item.harga.toLocaleString()}
          </Text>
        </View>
      ),
    },
    {
      label: "% Disc",
      styling: { justifyContent: "flex-end" },
      // stylingTD: { fontWeight: "bold" },
      width: "5%",
      render: (item: any) => (
        <View style={{ flexDirection: "row" }}>
          <Text style={{ width: "100%", textAlign: "right" }}>
            {item.diskon.toLocaleString()}
          </Text>
        </View>
      ),
    },
    {
      label: "SUBTOTAL",
      width: "10%",
      styling: { justifyContent: "flex-end" },
      // stylingTD: { fontWeight: "bold" },
      render: (item: any) => (
        <View style={{ flexDirection: "row" }}>
          <Text style={{ width: "100%", textAlign: "right" }}>
            {item.total.toLocaleString()}
          </Text>
        </View>
      ),
    },
  ];

  return (
    <Document style={styles.text}>
      {detailPages.map((page, pageIndex) => (
        <Page
          size={{ width: "135mm", height: "200mm" }}
          orientation="landscape"
          style={styles.page}
          key={pageIndex}
        >
          <View style={styles.head}>
            <View style={styles.brand}>
              <Text style={{ marginBottom: 2 }}>MENTARI JAYA</Text>
              <Text>SURABAYA</Text>
            </View>
            <Text style={styles.title}>FAKTUR</Text>
            <Text></Text>
          </View>

          <View style={styles.header}>
            <View>
              <View>
                {[
                  ["No Nota", nota.no_nota],
                  ["Tanggal", formatDate(nota.tanggal)],
                  ["Tanggal J/T", formatDate(nota.jt_tempo)],
                ].map(([label, value], index) => (
                  <View
                    key={index}
                    style={{ flexDirection: "row", marginBottom: 4 }}
                  >
                    <View style={{ width: 80 }}>
                      <Text>{label}</Text>
                    </View>
                    <View style={{ width: 10 }}>
                      <Text>:</Text>
                    </View>
                    <View>
                      <Text>{value}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.headerKanan}>
              <Text>Kepada, Yth</Text>
              {[[nota.pembeli], [nota.alamat]].map((value, index) => (
                <View
                  key={index}
                  style={{ flexDirection: "row", marginTop: 3 }}
                >
                  <View style={{ width: 80 }}>
                    <Text>{value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <Tabel
            tdStyle={{ padding: "2px", border: "0px" }}
            weightings={[0.04, 0.35, 0.1, 0.11, 0.11, 0.1, 0.08, 0.11]}
          >
            <TH
              style={{
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
                paddingTop: "1.5px",
                paddingBottom: "1.5px",
                fontWeight: "normal",
              }}
            >
              {columns.map((col, i) => (
                <TD key={i} style={col.styling}>
                  {col.label}
                </TD>
              ))}
            </TH>
            {page.map((item, index) => (
              <TR key={index}>
                {columns.map((col, colIndex) => {
                  const content = col.render
                    ? col.render(item, index, pageIndex)
                    : item[col.key];

                  return (
                    <TD key={colIndex} style={col.stylingTD}>
                      {content}
                    </TD>
                  );
                })}
              </TR>
            ))}
          </Tabel>

          <View
            style={{
              borderStyle: "solid",
              borderTopWidth: 1,
              position: "absolute",
              bottom: 50,
            }}
          ></View>
          {pageIndex === detailPages.length - 1 && (
            <View style={styles.footer}>
              <View
                style={{
                  marginTop: 3,
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {/* Kolom 1: Hormat Kami */}
                <View style={{ width: "20%" }}>
                  <Text>HORMAT KAMI,</Text>
                  <Text style={{ marginBottom: 40 }}></Text>
                  <Text style={styles.space}>( )</Text>
                </View>

                {/* Kolom 2: Info Transfer */}
                <View
                  style={{
                    width: "47%",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  <Text style={{ marginBottom: 2 }}>
                    BILA SUDAH JATUH TEMPO
                  </Text>
                  <Text style={{ marginBottom: 2 }}>MOHON TRANSFER KE :</Text>
                  <Text style={{ marginBottom: 2 }}>BCA : 506 082 9499</Text>
                  <Text style={{ marginBottom: 2 }}>
                    BRI : 0587 0100 1434 535
                  </Text>
                  <Text style={{ marginBottom: 2 }}>A/N : GO GIOK LIE</Text>
                  <Text style={{ marginBottom: 3 }}>TERIMA KASIH</Text>
                </View>

                {/* Kolom 3: Harga */}
                <View style={{ width: "29%" }}>
                  <View style={styles.priceRow}>
                    <Text style={styles.label}>SUBTOTAL</Text>
                    <Text style={{ marginLeft: 3 }}>:</Text>
                    <Text style={styles.value}>
                      Rp. {nota.subtotal.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.label}>
                      DISKON {nota.diskon_persen.toFixed(0)} %
                    </Text>
                    <Text style={{ marginLeft: 3 }}>:</Text>
                    <Text style={styles.value}>Rp. {nota.diskon_rupiah}</Text>
                  </View>
                  <View style={styles.priceRowTotal}>
                    <Text style={styles.label}>TOTAL</Text>
                    <Text style={{ marginLeft: 3 }}>:</Text>
                    <Text style={styles.value}>
                      Rp. {nota.total_harga.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </Page>
      ))}
    </Document>
  );
};

const DetailNota = () => {
  const { notaId } = useParams();
  const parsedNotaId = notaId ? Number(notaId) : undefined;
  const queryClient = useQueryClient();
  
  const { data: notaList } = useGetAllNota();
  
  const nota = notaList?.find((n) => n.id === parsedNotaId);

  const { data: detailsData } = useGetDetailNota(parsedNotaId!);
  const { mutate: updateNotaMutate } = useUpdateNota();
  const { mutate: deleteDetail } = useDeleteDetailNota();
  
  // const currentDate = new Date();
  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");
  const formatDateToYMD = (dateStr: string) => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  // const tanggal = new Date();
  // const tempo = addMonths(tanggal, 2);

  const [formData, setFormData] = useState({
    no_nota: "",
    pembeli: "",
    tanggal: "",
    alamat: "",
    jt_tempo: "",
  });

  const [diskonPersen, setDiskonPersen] = useState(0);
  const [diskonRupiah, setDiskonRupiah] = useState(0);
  const [details, setDetails] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [editedRows, setEditedRows] = useState<Record<number, any>>({});

  // Fungsi untuk hitung ulang detail
  const calculateDetail = (item: any) => {
    const coly = parseInt(item.coly) || 0;
    const qty_isi = parseInt(item.qty_isi) || 0;
    const harga = parseFloat(item.harga) || 0;
    const diskon = parseFloat(item.diskon) || 0;

    const jumlah = coly * qty_isi;
    const total = jumlah * harga * (1 - diskon / 100);

    return {
      ...item,
      coly,
      qty_isi,
      harga,
      diskon,
      jumlah,
      total,
    };
  };

  useEffect(() => {
    if (nota) {
      setFormData({
        no_nota: nota.no_nota,
        pembeli: nota.pembeli,
        tanggal: nota.tanggal,
        alamat: nota.alamat,
        jt_tempo: nota.jt_tempo,
      });
    }

    if (detailsData) {
      const recalculated = detailsData.map((item: any) =>
        calculateDetail(item)
      );
      setDetails(recalculated);
    }
  }, [nota, detailsData]);

  const handleStartEdit = (index: number) => {
    setEditIndex(index);
    setEditForm({ ...details[index] }); 
  };

  const handleNotaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (
    field: "tanggal" | "jt_tempo",
    date: Date | undefined
  ) => {
    if (!date) return;
    setFormData((prev) => ({
      ...prev,
      [field]: date.toISOString().split("T")[0],
    }));
  };

  const handleDetailChange = (id: number, field: string, value: any) => {
    setDetails((prevDetails) =>
      prevDetails.map((item) =>
        item.id === id
          ? calculateDetail({
              ...item,
              [field]: value,
            })
          : item
      )
    );
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  const handleDeleteDetail = (id: number) => {
    const filtered = details.filter((item) => item.id !== id);
    setDetails(filtered);
    deleteDetail(id); // Pastikan deleteDetail ini async-safe dan handle error
  };

  const calculateTotals = () => {
    const subtotal = details.reduce((sum, item) => sum + item.total, 0);
    const totalColy = details.reduce((sum, item) => sum + item.coly, 0);
    return { subtotal, totalColy };
  };

  const { subtotal, totalColy } = calculateTotals();

  const handleUpdateAll = () => {
    if (!parsedNotaId) return;

    const { subtotal } = calculateTotals(); // Hitung subtotal

    updateNotaMutate(
      {
        id: parsedNotaId,
        data: {
          ...formData,
          tanggal: formatDateToYMD(formData.tanggal),
          jt_tempo: formatDateToYMD(formData.jt_tempo),
          total_coly: totalColy,
          diskon_persen: diskonPersen,
          diskon_rupiah: diskonRupiah,
          details,
          subtotal,
          total_harga: subtotal - diskonRupiah,
        },
      },
      {
        onSuccess: () => {
          console.log("Update successful");
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Nota berhasil diperbarui.",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          queryClient.invalidateQueries({ queryKey: ["detail nota"] });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text:
                error.response?.data ||
                "Terjadi kesalahan saat memperbarui nota.",
              confirmButtonText: "OK",
            });
          }
        },
      }
    );
  };

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "no",
        header: "No",
        size: 50,
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "nama_barang",
        header: "Nama Barang",
        size: 250,
        cell: ({ row }) =>
          editIndex === row.index ? (
            <Input
              value={row.original.nama_barang}
              onChange={(e) =>
                handleDetailChange(
                  row.original.id,
                  "nama_barang",
                  e.target.value
                )
              }
            />
          ) : (
            row.original.nama_barang
          ),
      },
      {
        accessorKey: "coly",
        header: "Coly",
        size: 50,
        cell: ({ row }) =>
          editIndex === row.index ? (
            <div className="flex gap-1">
              <Input
                value={Number(row.original.coly).toFixed(2)}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  handleDetailChange(row.original.id, "coly", e.target.value)
                }
                className="w-15"
              />
              <Input
                value={row.original.satuan_coly}
                onChange={(e) =>
                  handleDetailChange(
                    row.original.id,
                    "satuan_coly",
                    e.target.value
                  )
                }
                className="w-15"
              />
            </div>
          ) : (
            <div className="flex gap-1">              
              <p>{Number(row.original.coly).toFixed(2)}</p>
              <p>{row.original.satuan_coly}</p>
            </div>
          ),
      },
      {
        accessorKey: "qty_isi",
        header: "Qty",
        size: 50,
        cell: ({ row }) =>
          editIndex === row.index ? (
            <div className="flex gap-1">
              <Input
                value={Number(row.original.qty_isi).toFixed(2)}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  handleDetailChange(row.original.id, "qty_isi", parseFloat(e.target.value) || 0)
                }
                className="w-15"
              />
              <Input
                value={row.original.nama_isi}
                onChange={(e) =>
                  handleDetailChange(
                    row.original.id,
                    "nama_isi",
                    e.target.value
                  )
                }
                className="w-15"
              />
            </div>
          ) : (
            <div className="flex gap-1">
              <p>{Number(row.original.qty_isi).toFixed(2)}</p>
              <p>{row.original.nama_isi}</p>
            </div>
          ),
      },
      {
        accessorKey: "jumlah",
        header: "Total Qty",
        size: 50,
        cell: ({ row }) => (
          <div className="flex gap-1">
            <p>{row.original.jumlah}</p>
            <p>{row.original.nama_isi}</p>
          </div>
        ),
      },
      {
        accessorKey: "harga",
        header: "Harga",
        size: 50,
        cell: ({ row }) =>
          editIndex === row.index ? (
            <Input
              value={row.original.harga}
              onFocus={(e) => e.target.select()}
              onChange={(e) =>
                handleDetailChange(row.original.id, "harga", e.target.value)
              }
              className="w-24"
            />
          ) : (
            row.original.harga.toLocaleString("id-ID")
          ),
      },
      {
        accessorKey: "diskon",
        header: "% Disc",
        size: 50,
        cell: ({ row }) =>
          editIndex === row.index ? (
            <Input
              value={row.original.diskon}
              onFocus={(e) => e.target.select()}
              onChange={(e) =>
                handleDetailChange(row.original.id, "diskon", e.target.value)
              }
              className="w-10"
            />
          ) : (
            row.original.diskon
          ),
      },
      {
        accessorKey: "total",
        header: "Subtotal",
        size: 100,
        cell: ({ row }) => Number(row.original.total).toLocaleString("id-ID"),
      },
      {
        id: "actions",
        header: "Aksi",
        size: 100,
        cell: ({ row }) => (
          <div className="flex gap-2">
            {editIndex === row.index ? (
              <>
                <Button
                  className="b-simpan"
                  size="sm"
                  onClick={() => setEditIndex(null)}
                >
                  <CheckIcon size={16} />
                </Button>
                <button onClick={handleCancel} className="b-batal">
                  <XIcon size={16} />
                </button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditIndex(row.index)}
                className="b-edit"
              >
                <PencilIcon size={16} />
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteDetail(row.original.id)}
              className="b-delete"
            >
              <TrashIcon size={16} />
            </Button>
          </div>
        ),
      },
    ],
    [editIndex]
  );

  const table = useReactTable({
    data: details,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = async (notaId: number) => {
    const newWindow = window.open(`/nota/frontend/${notaId}/print`, "_blank");
  };
  // const handlePrint = async (notaId: number) => {
  //   const [notaList, detailList] = await Promise.all([
  //     getAllNota(),
  //     getAllDetailNota(notaId),
  //   ]);

  //   const nota = notaList.find((n) => n.id === notaId);
  //   if (!nota) {
  //     alert("Nota tidak ditemukan");
  //     return;
  //   }

  //   const chunkArray = (arr: any[], size: number) => {
  //     const result = [];
  //     for (let i = 0; i < arr.length; i += size) {
  //       result.push(arr.slice(i, i + size));
  //     }
  //     return result;
  //   };

  //   const detailPages = chunkArray(detailList, 12);

  //   const blob = await pdf(
  //     <NotaPDF nota={nota} detailPages={detailPages} styles={styles} />
  //   ).toBlob();

  //   const url = URL.createObjectURL(blob);
  //   const win = window.open(url);
  //   if (win) {
  //     win.onload = () => win.print();
  //   }
  // };

  return (
    <div className="container mx-auto px-6 py-8">
      <Button
        className="no-print mb-4"
        onClick={() => handlePrint(parsedNotaId)}
      >
        Print Nota
      </Button>
      <div ref={printRef}>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-10 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-10">
              <p>No Nota:</p>
              <Input className="w-1/2" value={nota?.no_nota} readOnly />
            </div>
            <div className="flex items-center gap-12">
              <label className="block">Tanggal</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="calender">
                    <CalendarIcon className="mr-2 h-4 w-1/2" />
                    {formData.tanggal
                      ? format(new Date(formData.tanggal), "dd MMM yyyy")
                      : "Pilih Tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <Calendar
                    mode="single"
                    selected={
                      formData.tanggal ? new Date(formData.tanggal) : undefined
                    }
                    onSelect={(date) => handleDateChange("tanggal", date)}
                    className="bg-white text-black [&_*]:!bg-white [&_*]:!text-black [&_.day-selected]:!bg-blue-500"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-3">
              <label className="block">Jatuh Tempo</label>
              <Popover>
                <PopoverTrigger asChild className="bg-white">
                  <Button variant="outline" className="calender">
                    <CalendarIcon className="mr-2 h-4 w-1/2" />
                    {formData.jt_tempo
                      ? format(new Date(formData.jt_tempo), "dd MMM yyyy")
                      : "Pilih Tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-auto p-0 bg-white border border-gray-300 shadow-md"
                >
                  <Calendar
                    mode="single"
                    selected={
                      formData.jt_tempo
                        ? new Date(formData.jt_tempo)
                        : undefined
                    }
                    onSelect={(date) => handleDateChange("jt_tempo", date)}
                    className="bg-white text-black [&_*]:!bg-white [&_*]:!text-black [&_.day-selected]:!bg-blue-500"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-4">
            <p>Kepada Yth:</p>
            <Input
              name="pembeli"
              value={formData.pembeli}
              onChange={handleNotaChange}
              placeholder="Masukkan Nama Pembeli"
            />
            <Input
              name="alamat"
              value={formData.alamat}
              onChange={handleNotaChange}
              placeholder="Masukkan Alamat"
            />
          </div>
        </div>

        <div className="flex justify-end mb-5">
          <AddDetailModal
            onAdd={(newDetail) => {
              setDetails((prev) => [...prev, newDetail]); 
            }}
          />
        </div>

        <Table className="mb-4 uppercase">
          <TableHeader className="font-bold">
            <TableRow>
              {table.getHeaderGroups().map((group) =>
                group.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
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
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7} className="text-right">
                Subtotal:
              </TableCell>
              <TableCell>Rp. {subtotal.toLocaleString("id-ID")}</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={7} className="text-right">
                Diskon:
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Input
                    className="w-20"
                    value={diskonPersen}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setDiskonPersen(val);
                      setDiskonRupiah((subtotal * val) / 100);
                    }}
                    placeholder="Diskon %"
                    type="number"
                  />{" "}
                  <span>%</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span>Rp</span>
                  <Input
                    className="w-20"
                    value={diskonRupiah}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setDiskonRupiah(val);
                      setDiskonPersen((val / subtotal) * 100);
                    }}
                    placeholder="Diskon Rp"
                    type="number"
                  />
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={7} className="text-right">
                Total:
              </TableCell>
              <TableCell className="font-bold">
                Rp. {(subtotal - diskonRupiah).toLocaleString("id-ID")}
              </TableCell>
              <TableCell>
                <Button
                  onClick={handleUpdateAll}
                  className="flex gap-2 items-center"
                >
                  <SaveIcon size={16} />
                  Save All
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default DetailNota;
