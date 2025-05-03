import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, View, Text, PDFViewer, Image, pdf } from '@react-pdf/renderer';
import { styles } from './style';
import { logo } from './image';
import { useGetAllNota, useGetDetailNota } from '@/services/queries';
import { Button } from '@/components/ui/button';
import {Table, TR, TH, TD} from '@ag-media/react-pdf-table';

const MAX_ITEM_PER_PAGE = 11;

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
  const month = d.getMonth();
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function Generate() {
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

const columns = [
  {
    label: 'No',
    textAlignHeader: 'flex-start',
    width: '5%',
    render: (_item: any, index: number, pageIndex: number) =>
      pageIndex * MAX_ITEM_PER_PAGE + index + 1,
  },
  {
    label: 'NAMA BARANG',
    textAlignHeader: 'flex-start',
    width: '25%',
    key: 'nama_barang',
  },
  {
    label: 'COLY',
    width: '10%',
    textAlign: 'flex-end',
    render: (item: any) => <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
      <Text style={{width: 10, textAlign: "right"}}>{item.coly}</Text>
      <Text>{item.satuan_coly}</Text>
    </View>,
  },
  {
    label: 'ISI',
    width: '15%',
    textAlign: 'flex-start',
    render: (item: any) => 
    <View style={{ flexDirection: 'row', width: '90%', padding: "1px"}}>
      <Text style={{width: 10, textAlign: "right"}}>@ </Text>
      <Text style={{width: 10, textAlign: "left", marginRight: 4}}>{item.qty_isi}</Text>
      <Text > {item.nama_isi}</Text>
    </View>
  },
  {
    label: 'TOTAL QTY',
    width: '15%',
    textAlign: 'flex-end',
    render: (item: any) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '75%'  }}>
      <Text style={{width: 10, textAlign: "right"}}>{item.jumlah}</Text>
      <Text> {item.nama_isi}</Text>
    </View>),
  },
  {
    label: 'HARGA',
    width: '15%',
    textAlign: 'flex-end',
    render: (item: any) => `${item.harga.toLocaleString()}`,
  },
  {
    label: '% Disc',
    textAlign: 'flex-end',
    width: '15%',
    render: (item: any) => `${item.diskon.toLocaleString()}`,
  },
  {
    label: 'TOTAL',
    width: '15%',
    textAlign: 'flex-end',
    render: (item: any) => `${item.total.toLocaleString()}`,
  },
];

  const NotaPDF = () => (
    <Document>
      
      {detailPages.map((page, pageIndex) => (
           <Page size="A6" orientation="landscape" style={styles.page} key={pageIndex}>
          <View style={styles.head}>
            <Image src={logo} style={styles.image} />
            <Text style={styles.title}>FAKTUR</Text>
          </View>

          <View style={styles.header}>
            <View>
              <View style={{ marginTop: 5 }}>
                {[
                  ['No Nota', nota.no_nota],
                  ['Tanggal', formatDate(nota.tanggal)],
                  ['Tanggal J/T', formatDate(nota.jt_tempo)],
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
              {/* <Text style={styles.tBold}>Surabaya, </Text> */}
              <Text>Kepada, Yth</Text>
              {[
                [nota.pembeli],
                [nota.alamat],                
                ].map((value, index) => (
                  <View key={index} style={{ flexDirection: 'row', marginTop: 3  }}>
                    <View style={{ width: 60 }}>
                      <Text>{value}</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>

          <Table style={{border: "0px", padding: 2}}>
            <TH style={styles.th}>
                {columns.map((col, i) => (
                <TD key={i} 
                    weighting={col.width}
                    style={{justifyContent: col.textAlignHeader || 'center'}}
                    >
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
                    <TD key={colIndex} 
                        weighting={ col.width}
                        style={{padding: "1px", justifyContent: col.textAlign || 'left'}}
                    >
                        {content}
                    </TD>
                    );
                })}
                </TR>
            ))}
          </Table>

          {/* <View style={styles.table}>
            <View style={styles.tableRow}>
              {columns.map((col, i) => (
                <View key={i} style={[styles.tableColHeader, { width: col.width }]}>
                  <Text style={[styles.tableCell, { textAlign: col.textAlignHeader || 'center' }]}>{col.label}</Text>
                </View>
              ))}
            </View>

            {page.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                {columns.map((col, colIndex) => {
                  const content = col.render
                    ? col.render(item, index, pageIndex)
                    : item[col.key];

                  return (
                    <View key={colIndex} style={[styles.tableCol, { width: col.width }]}>
                      <Text style={[styles.tableCell, { textAlign: col.textAlign || 'left' }]}>{content}</Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View> */}

          {pageIndex === detailPages.length - 1 && (
           <View fixed style={styles.fixedFooter}>
             <View>                              
                {/* <View style={[styles.tableRow]}>     
                  <View style={[styles.tableCol, { width: '77', textAlign: 'left' }]}>
                    <Text style={[ styles.tBold]}>Hormat Kami,</Text>
                  </View>
                  <View style={[styles.tableCol, { width: '53%', textAlign: 'center' }]}>
                    <Text style={[ styles.tBold]}>Bila sudah jatuh tempo mohon transfer ke </Text>
                  </View>
                  <View style={[styles.tableCol, {  textAlign: 'right' }]}>
                    <Text style={[ styles.tBold]}>Diskon {nota.diskon_persen.toLocaleString()} % :</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={[ styles.tBold]}>Rp. {nota.diskon_rupiah.toLocaleString()}</Text>
                  </View>              
                </View>        */}

                {/* <View style={[styles.tableRow]}>
                  <View style={[styles.tableCol, { width: '20%', textAlign: 'left' }]}>
                    <Text style={[ styles.tBold]}></Text>
                  </View>
                  <View style={[styles.tableCol, { width: '53%', textAlign: 'center' }]}>
                    <Text style={[ styles.tBold]}>BCA: 8650 577 397, BRI: 0440 0101 3845 504</Text>
                  </View>
                  <View style={[styles.tableCol, { textAlign: 'right' }]}>
                    <Text style={[ styles.tBold]}>Subotal :</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={[ styles.tBold]}>Rp. {nota.subtotal.toLocaleString()}</Text>
                  </View>
                </View> */}

                {/* <View style={[styles.tableRow]}>
                  <View style={[styles.tableCol, { width: '20%', textAlign: 'left' }]}>
                    <Text style={[ styles.tBold]}>(
                      <Text>
                      <View style={{width: 80}}/>
                      </Text>
                      )</Text>
                  </View>
                  <View style={[styles.tableCol, { width: '53%', textAlign: 'center' }]}>
                    <Text style={[ styles.tBold]}>A/N: NANI, Terima kasih</Text>
                  </View>
                  <View style={[styles.tableCol, {  textAlign: 'right' }]}>
                    <Text style={[ styles.tBold]}>Total :</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={[ styles.tBold]}>Rp. {nota.total_harga.toLocaleString()}</Text>
                  </View>
                </View> */}
                
                <View style={[styles.tableRow]}>     
                  {/* pertama */}
                  <View style={[styles.tableCol, { width: '77', textAlign: 'left' }]}>
                    <Text style={[ styles.tBold]}>Hormat Kami,</Text>
                  </View>
                  <View style={[styles.tableCol, { width: '53%', textAlign: 'center' }]}>
                    <Text style={[ styles.tBold]}>Bila sudah jatuh tempo,  </Text>
                  </View>
                  <View style={[styles.tableCol, {  textAlign: 'right' }]}>
                    <Text style={[ styles.tBold]}>Diskon {nota.diskon_persen.toLocaleString()} % :</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={[ styles.tBold]}>Rp. {nota.diskon_rupiah.toLocaleString()}</Text>
                  </View>              
                </View>       

                <View style={[styles.tableRow]}>
                  <View style={[styles.tableCol, { width: '20%', textAlign: 'left' }]}>
                    <Text style={[ styles.tBold]}></Text>
                  </View>
                  <View style={[styles.tableCol, { width: '53%', textAlign: 'center' }]}>
                    <Text style={[ styles.tBold]}>Mohon transfer ke</Text>
                  </View>
                  <View style={[styles.tableCol, { textAlign: 'right' }]}>
                    <Text style={[ styles.tBold]}>Subotal :</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={[ styles.tBold]}>Rp. {nota.subtotal.toLocaleString()}</Text>
                  </View>
                </View>

                <View style={[styles.tableRow]}>
                  <View style={[styles.tableCol, { width: '20%', textAlign: 'left' }]}>
                    {/* <Text style={[ styles.tBold]}>(
                      <Text>
                      <View style={{width: 80}}/>
                      </Text>
                      )</Text> */}
                  </View>
                  <View style={[styles.tableCol, { width: '53%', textAlign: 'center' }]}>
                    <Text style={[ styles.tBold]}>BCA: 8650 577 397</Text>
                  </View>
                  <View style={[styles.tableCol, {  textAlign: 'right' }]}>
                    <Text style={[ styles.tBold]}>Total :</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={[ styles.tBold]}>Rp. {nota.total_harga.toLocaleString()}</Text>
                  </View>
                </View>
                
                <View style={[styles.tableRow]}>
                  <View style={[styles.tableCol, { width: '93%', textAlign: 'center' }]}>
                    <Text style={[ styles.tBold]}>BRI: 0440 0101 3845 504</Text>
                  </View>
                </View>

                <View style={[styles.tableRow]}>
                  <View style={[styles.tableCol, { width: '20%', textAlign: 'left' }]}>
                    <Text style={[ styles.tBold]}>(                   )</Text>
                  </View>
                  <View style={[styles.tableCol, { width: '53%', textAlign: 'center' }]}>
                    <Text style={[ styles.tBold]}>A/N: NANI</Text>
                  </View>
                </View>
                <View style={[styles.tableRow]}>
                  <View style={[styles.tableCol, { width: '93%', textAlign: 'center' }]}>
                    <Text style={[ styles.tBold]}>Terima kasih</Text>
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
      <div style={{ height: '90vh' }}>
        <Button className="no-print mb-4" onClick={() => handlePrint()}>Print Nota</Button>
          <div id="print-area" className="print-area a6-landscape" style={{ height: '90vh' }}>
            <PDFViewer width="100%" height="100%">
              <NotaPDF />
            </PDFViewer>               
          </div>
      </div>
    </div>
  );
}
