import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 10,
    fontSize: 6,
    paddingBottom: 30,
    position: "relative",
  },
  head: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
    marginTop: 2,
    marginLeft: 10,
  },
  headerKanan: {
    width: "35%",
    alignItems: "flex-start",
    // marginRight: 20
    // paddingLeft: 20,
  },
  title: {
    alignSelf: "center",
    marginBottom: 10,
    textDecoration: "underline",
    fontSize: 10,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: "auto",
    marginRight: 70,
  },

  footer: {
    position: "absolute",
    bottom: 2,
    marginBottom: 2,
    // left: 20,
    // right: 15,
    fontWeight: "bold",
    fontSize: 6,
    borderStyle: "solid",
    borderTopWidth: 1,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 6,
    marginBottom: 4,
  },
  space: {
    whiteSpace: "pre",
  },
  label: {
    width: "40%",
  },
  value: {
    width: "60%",
    marginLeft: "5px",
    textAlign: "left",
  },
});
