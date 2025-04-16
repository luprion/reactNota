const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors")
const bodyParser = require("body-parser");
const db = require("./database/db");
const response = require("./response");

app.use(cors());

app.use(bodyParser.json());

// mendapatkan semua nota
app.get("/", (req, res) => {
  const sql = "SELECT * FROM nota";
  db.query(sql, (error, result) => {
    if (error) return response(400, error, "cannot get data", res);
    response(200, result, "success get all nota", res);
  });
});

// mendapatkan semua deil nota                
app.get("/detail-notas", (req, res) => {
  const sql = "SELECT * FROM detail_nota";
  db.query(sql, (error, result) => {
    if (error) return response(400, error, "cannot get data", res);
    response(200, result, "success get all detail-nota", res);
  });
});

// mendapatkan detail sesuai nota id
app.get("/detail-nota/:nota_id", (req, res) => {
  const { nota_id } = req.params;

  if (!nota_id) {
    return response(400, null, "nota_id is required", res);
  }

  const sql = "SELECT * FROM detail_nota WHERE nota_id = ?";
  db.query(sql, [nota_id], (error, result) => {
    if (error) {
      return response(400, error, "Cannot get detail-nota", res);
    }
    if (result.length === 0) {
      return response(404, null, "No details found for this nota_id", res);
    }
    response(200, result, "Success get detail-nota", res);
  });
});

// tambah nota
// app.post("/nota", (req, res) => {
//   const { no_nota, tanggal, pembeli, alamat, total_harga, total_coly, jt_tempo } = req.body;
//   const sql = "INSERT INTO nota (no_nota, tanggal, pembeli, alamat, total_harga, total_coly, jt_tempo, status) VALUES (?, ?, ?, ?, ?, ?, ?, 1)";
//   db.query(sql, [no_nota, tanggal, pembeli, alamat, total_harga, total_coly, jt_tempo], (error, result) => {
//     if (error) return response(400, error, "failed to create nota", res);
//     response(201, { id: result.insertId }, "nota created successfully", res);
//   });
// });

// edit nota
app.put("/nota/:id", (req, res) => {
  const { id } = req.params;
  const { no_nota, tanggal, pembeli, alamat, total_harga, total_coly, jt_tempo } = req.body;
  const sql = "UPDATE nota SET no_nota = ?, tanggal = ?, pembeli = ?, alamat = ?, total_harga = ?, total_coly = ?, jt_tempo = ? WHERE id = ?";
  db.query(sql, [no_nota, tanggal, pembeli, alamat, total_harga, total_coly, jt_tempo, id], (error, result) => {
    if (error) return response(400, error, "failed to update nota", res);
    response(200, { affectedRows: result.affectedRows }, "nota updated successfully", res);
  });
});

// soft-delete, mengubah status jadi 0 ji
app.put("/nota/:id/status", (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE nota SET status = 0 WHERE id = ?";
  db.query(sql, [id], (error, result) => {
    if (error) return response(400, error, "failed to update status", res);
    response(200, { affectedRows: result.affectedRows }, "nota status updated to 0", res);
  });
});

// tambah detail nota(validasi nota_id harus ada)
app.post("/nota", (req, res) => {
  const { no_nota, tanggal, pembeli, alamat, subtotal, diskon_persen, diskon_rupiah, total_harga, total_coly, jt_tempo, details } = req.body;

  // Query untuk insert ke tabel nota
  const sqlNota = "INSERT INTO nota (no_nota, tanggal, pembeli, alamat, subtotal, diskon_persen, diskon_rupiah, total_harga, total_coly, jt_tempo, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)";

  db.beginTransaction((err) => {
    if (err) return response(500, err, "Transaction error", res);

    db.query(sqlNota, [no_nota, tanggal, pembeli, alamat, subtotal, diskon_persen, diskon_rupiah, total_harga, total_coly, jt_tempo], (error, result) => {
      if (error) {
        return db.rollback(() => {
          response(400, error, "Failed to create nota", res);
        });
      }

      const nota_id = result.insertId; // Dapatkan ID nota yang baru dibuat

      // Query untuk insert ke tabel detail_nota
      const sqlDetail = "INSERT INTO detail_nota (nota_id, nama_barang, coly, qty_isi, nama_isi, jumlah, harga, diskon, total) VALUES ?";

      // Buat array dari details yang dikirim dalam request
      const detailValues = details.map(item => [nota_id, item.nama_barang, item.coly, item.qty_isi, item.nama_isi, item.jumlah, item.harga, item.diskon, item.total]);

      db.query(sqlDetail, [detailValues], (errDetail, resultDetail) => {
        if (errDetail) {
          return db.rollback(() => {
            response(400, errDetail, "Failed to create detail nota", res);
          });
        }

        // Commit transaksi jika semua berhasil
        db.commit((commitErr) => {
          if (commitErr) {
            return db.rollback(() => {
              response(500, commitErr, "Transaction commit failed", res);
            });
          }
          response(201, { nota_id, detail_inserted: resultDetail.affectedRows }, "Nota and detail nota created successfully", res);
        });
      });
    });
  });
});


// edit detail nota (validasi nota_id harus ada)
app.put("/detail-nota/:id", (req, res) => {
  const { id } = req.params;
  const { nota_id, nama_barang, coly, qty_isi, nama_isi, jumlah, harga, total } = req.body;

  //cek nota_id
  db.query("SELECT id FROM nota WHERE id = ?", [nota_id], (error, result) => {
    if (error || result.length === 0) return response(400, "Invalid nota_id", "nota_id not found", res);

    // jika nota_id validn, update data
    const sql = "UPDATE detail_nota SET nama_barang = ?, coly = ?, qty_isi = ?, nama_isi = ?, jumlah = ?, harga = ?, total = ? WHERE id = ? AND nota_id = ?";
    db.query(sql, [nama_barang, coly, qty_isi, nama_isi, jumlah, harga, total, id, nota_id], (err, result) => {
      if (err) return response(400, err, "failed to update detail nota", res);
      response(200, { affectedRows: result.affectedRows }, "detail nota updated successfully", res);
    });
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
