import { useParams } from "react-router-dom";
import {
  Document,
  Page,
  View,
  Text,
  PDFViewer,
  Image,
  pdf,
} from "@react-pdf/renderer";
import { styles } from "./style";
import { logo } from "./image";
import { useGetAllNota, useGetDetailNota } from "@/services/queries";
import { Button } from "@/components/ui/button";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";

const MAX_ITEM_PER_PAGE = 14;

const chunkArray = (array: any[], size: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const formatDate = (date: string) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.getMonth();
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function Generate() {
  const { notaId } = useParams();
   const parsedNotaId = notaId ? Number(notaId) : undefined;
  const { data: notaList } = useGetAllNota();
  const { data: details } = useGetDetailNota(parsedNotaId!);

  const nota = notaList?.find((n) => n.id === parsedNotaId);

  // JANGAN render PDF sebelum data lengkap
  if (!nota || !details) return <div>Loading...</div>;

  const detailPages = chunkArray(details, MAX_ITEM_PER_PAGE);

  const handlePrint = async () => {
    const blob = await pdf(<NotaPDF />).toBlob();
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url);
    if (newWindow) {
      newWindow.onload = () => {
        newWindow?.print();
      };
    }
  };

  const columns = [
    {
      label: "No",
      textAlignHeader: "flex-start",
      width: "5%",
      render: (_item: any, index: number, pageIndex: number) =>
        pageIndex * MAX_ITEM_PER_PAGE + index + 1,
    },
    {
      label: "NAMA BARANG",
      textAlignHeader: "flex-start",
      width: "25%",
      key: "nama_barang",
    },
    {
      label: "COLY",
      width: "15%",
      textAlign: "center",
      render: (item: any) => (
        <View style={{ flexDirection: "row", width: "100%" }}>
          <Text style={{ width: 15, textAlign: "right" }}>{item.coly}</Text>
          <Text style={{ marginLeft: 2 }}>{item.satuan_coly}</Text>
        </View>
      ),
    },
    {
      label: "ISI",
      width: "15%",
      textAlign: "center",
      render: (item: any) => (
        <View style={{ flexDirection: "row", width: "100%" }}>
          {/* <Text style={{ width: 5, textAlign: "right" }}>@ </Text> */}
          <Text style={{ width: 17, textAlign: "right" }}>{item.qty_isi}</Text>
          <Text style={{ marginLeft: 2 }}>{item.nama_isi}</Text>
        </View>
      ),
    },
    {
      label: "TOTAL QTY",
      width: "15%",
      textAlign: "center",
      render: (item: any) => (
        <View style={{ flexDirection: "row", width: "100%" }}>
          <Text style={{ width: 15, textAlign: "right" }}>{item.jumlah}</Text>
          <Text style={{ marginLeft: 2 }}> {item.nama_isi}</Text>
        </View>
      ),
    },
    {
      label: "HARGA",
      width: "10%",
      textAlign: "flex-end",
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
      textAlign: "flex-end",
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
      label: "TOTAL",
      width: "10%",
      textAlign: "flex-end",
      render: (item: any) => (
        <View style={{ flexDirection: "row" }}>
          <Text style={{ width: "100%", textAlign: "right" }}>
            {item.total.toLocaleString()}
          </Text>
        </View>
      ),
    },
  ];

  const NotaPDF = () => (
    <Document>
      {detailPages.map((page, pageIndex) => (
        <Page
          size="A6"
          orientation="landscape"
          style={styles.page}
          key={pageIndex}
        >
          <View style={styles.head}>
            <Image src={logo} style={styles.image} />
            <Text style={styles.title}>FAKTUR</Text>
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
                    <View style={{ width: 60 }}>
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

          <Table
            tdStyle={{ padding: "2px", fontSize: "6px", border: "0px" }}
            weightings={[0.04, 0.35, 0.1, 0.11, 0.11, 0.1, 0.08, 0.11]}
          >
            <TH
              style={{
                borderTop: "0.5px solid black",
                borderBottom: "0.5px solid black",
              }}
            >
              {columns.map((col, i) => (
                <TD key={i} style={{ justifyContent: col.textAlign }}>
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

                  return <TD key={colIndex}>{content}</TD>;
                })}
              </TR>
            ))}
          </Table>

          <View
            style={{
              borderStyle: "solid",
              borderTopWidth: 1,
              position: "absolute",
              bottom: 40,
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
                  <Text style={{ marginBottom: 30 }}></Text>
                  <Text style={styles.space}>(                         )</Text>
                </View>

                {/* Kolom 2: Info Transfer */}
                <View style={{ width: "47%", textAlign: "center" }}>
                  <Text style={{ marginBottom: 2 }}>
                    BILA SUDAH JATUH TEMPO
                  </Text>
                  <Text style={{ marginBottom: 2 }}>MOHON TRANSFER KE:</Text>
                  <Text style={{ marginBottom: 2 }}>BCA : 8650 577 397</Text>
                  <Text style={{ marginBottom: 2 }}>
                    BRI : 0440 0101 3845 504
                  </Text>
                  <Text style={{ marginBottom: 2 }}>A/N : NANI</Text>
                  <Text style={{ marginBottom: 3 }}>TERIMA KASIH</Text>
                </View>

                {/* Kolom 3: Harga */}
                <View style={{ width: "29%" }}>
                  <View style={styles.priceRow}>
                    <Text style={styles.label}>DISKON 0 %</Text>
                    <Text style={{ marginLeft: 3 }}>:</Text>
                    <Text style={styles.value}>Rp. 0</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.label}>SUBTOTAL</Text>
                    <Text style={{ marginLeft: 3 }}>:</Text>
                    <Text style={styles.value}>Rp. {nota.subtotal.toLocaleString()}</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.label}>TOTAL</Text>
                    <Text style={{ marginLeft: 3 }}>:</Text>
                    <Text style={styles.value}>Rp. {nota.total_harga.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </Page>
      ))}
    </Document>
  );

  return (
    <div className="container place-content-center mx-auto px-6 py-8">
      <div style={{ height: "90vh" }}>
        <Button className="no-print mb-4" onClick={() => handlePrint()}>
          Print Nota
        </Button>
        <div
          id="print-area"
          className="print-area a6-landscape"
          style={{ height: "90vh" }}
        >
          <PDFViewer width="100%" height="100%">
            <NotaPDF />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}
