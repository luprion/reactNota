import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
   page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 10,
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,

  },
  headerKanan: {
    marginRight:10,
    maxWidth: 130,
    marginTop: 20
  },
  title: {
    alignSelf: 'center',
    marginBottom: 10,
    textDecoration: 'underline',
    fontSize: 10,
  },
  tBold: {
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '14.28%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    backgroundColor: '#eee',
    padding: 3,
  },
  tableCol: {
    width: '14.28%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 3,
  },
  tableCell: {
    fontSize: 6,
  },
  image: {
    width: 100,
    height: 'auto'
  }
});
