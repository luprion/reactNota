import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
   page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 10,
    fontSize: 8,
    paddingBottom: 30,
    position: 'relative'
  },
  head: {
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,

  },
  headerKanan: {
    width: '40%',
    alignItems: 'flex-start', 
    marginTop: 10,
    paddingLeft: 20,
  },
  title: {
    alignSelf: 'center',
    marginBottom: 10,
    textDecoration: 'underline',
    fontSize: 10,
    fontWeight: 'bold',
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
    borderRightWidth: 1,
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
    // borderStyle: 'solid',
    padding: 3,
  },
  tableFooter: {
    borderStyle: 'solid',
    borderWidth: 1,

  },
  tableCell: {
    fontSize: 6,
  },
  image: {
    width: 100,
    height: 'auto',
    marginRight: 70
  },
  fixedFooter: {
  position: 'absolute',
  bottom: 0,    
  height: 50,
  justifyContent: 'space-between',
  alignItems: 'center',
  borderStyle: 'solid',
  borderTopWidth: 1,
  maxWidth: '97%',
},

footerText: {
  fontSize: 9,
  color: '#000',  
  padding: 5,  
  maxWidth: '55%'
}
});
