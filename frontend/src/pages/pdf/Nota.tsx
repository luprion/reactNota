import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, View, Text, PDFViewer, Image, pdf } from '@react-pdf/renderer';
import { styles } from './style';
import { logo } from './image';
import { useGetAllNota, useGetDetailNota } from '@/services/queries';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';

const MAX_ITEM_PER_PAGE = 10;

const chunkArray = (array: any[], size: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const formatDate = (date: string) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('id-ID', { month: 'long' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

export default function Preview() {
  const { notaId } = useParams();
  const { data: notaList } = useGetAllNota();
  const { data: details } = useGetDetailNota(notaId);

  const nota = notaList?.find((n) => n.id === Number(notaId));

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

  const NotaPDF = () => (
    <Document>
      
      {detailPages.map((page, pageIndex) => (
           <Page size="A6" orientation="landscape" style={styles.page} key={pageIndex}>
          <View style={styles.title}>
            <Text style={styles.tBold}>Nota</Text>
          </View>

          <View style={styles.header}>
            <View>
              <Image src={logo} style={styles.image} />
              <View style={{ marginTop: 5 }}>
                {[
                  ['No Nota', nota.no_nota],
                  ['Tanggal', formatDate(nota.tanggal)],
                  ['Jatuh Tempo', nota.jt_tempo],
                ].map(([label, value], index) => (
                  <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
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
              <Text style={styles.tBold}>Surabaya, </Text>
              <Text>Kepada, Yth</Text>
              <Text>{nota.pembeli}</Text>
              <Text>{nota.alamat}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              {['No', 'COLY', 'ISI', 'JUMLAH', 'NAMA BARANG', 'HARGA', 'TOTAL'].map((header, i) => (
                <View style={styles.tableColHeader} key={i}>
                  <Text style={styles.tableCell}>{header}</Text>
                </View>
              ))}
            </View>

            {page.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{pageIndex * MAX_ITEM_PER_PAGE + index + 1}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.coly}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.qty_isi} {item.nama_isi}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.jumlah} {item.nama_isi}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.nama_barang}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>Rp. {item.harga.toLocaleString()}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>Rp. {item.total.toLocaleString()}</Text></View>
              </View>
            ))}

            {pageIndex === detailPages.length - 1 && (
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '85.72%' }]}>
                  <Text style={[styles.tableCell, styles.tBold]}>Total</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.tBold]}>Rp. {nota.total_harga.toLocaleString()}</Text>
                </View>
              </View>
            )}
          </View>
        </Page>
       
      ))}
    </Document>
  );

  return (
    <div style={{ height: '90vh' }}>
      <Button className="no-print mb-4" onClick={() => handlePrint()}>Print Nota</Button>
        <div id="print-area" className="print-area a6-landscape" style={{ height: '90vh' }}>
          <PDFViewer width="100%" height="100%">
            <NotaPDF />
          </PDFViewer>               
        </div>
    </div>
  );
}
