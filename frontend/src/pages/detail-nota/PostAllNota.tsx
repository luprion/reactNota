import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PlusIcon, PrinterIcon, SaveIcon } from "lucide-react";
import { format } from "date-fns";
import { useCreateDetailNota, useCreateNota } from "@/services/mutations";
import { useNavigate } from "react-router-dom";

const PostAllNota = () => {
    const navigate = useNavigate();
    const currentDate = new Date();
    const formattedNoNota = format(currentDate, "yyyyMMddHHmmss");
    const formatDate = (date) => format(date, "yyyy-MM-dd");

    const { mutate: createNota, isPending } = useCreateNota();
    const { mutate: createDetailNota } = useCreateDetailNota()

  const form = useForm({
    defaultValues: {
      no_nota: formattedNoNota,
      tanggal: formatDate(new Date()),
      jt_tempo: "",
      pembeli: "",
      alamat: "",
      total_harga: 0,
      total_coly: 0,
      details: [],
    },
  });

  const { register, handleSubmit, control, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "details" });

  const details = watch("details");
  const totalColy = details.reduce((sum, d) => sum + (d.coly || 0), 0);
  const totalHarga = details.reduce(
    (sum, d) => sum + (d.coly * d.qty_isi * d.harga || 0),
    0
  );

  const onSubmit = async (data) => {
    const formattedData = {
      no_nota: data.no_nota,
      tanggal: formatDate(new Date(data.tanggal)),
      jt_tempo: formatDate(new Date(data.jt_tempo)),
      pembeli: data.pembeli,
      alamat: data.alamat,
      total_harga: totalHarga,
      total_coly: totalColy,
    };

    createNota(formattedData, {
      onSuccess: (nota) => {
        const notaId = nota.id;
        const detailsData = data.details.map((d) => ({
          nota_id: notaId,
          nama_barang: d.nama_barang,
          coly: d.coly,
          qty_isi: d.qty_isi,
          nama_isi: d.nama_isi,
          harga: d.harga,
          jumlah: d.coly * d.qty_isi,
          total: d.coly * d.qty_isi * d.harga,
        }));
        createDetailNota(detailsData, {
          onSuccess: () => navigate(`/nota/${notaId}`),
        });
      },
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-start gap-2 items-center mb-4">
            <h2 className="text-lg font-bold">Nota</h2>
            <Input {...register("no_nota")} className="w-24 text-center" readOnly />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Tanggal</label>
              <Input type="date" {...register("tanggal")} />
            </div>
            <div>
              <label className="block text-sm font-medium">Jatuh Tempo</label>
              <Input type="date" {...register("jt_tempo")} />
            </div>
            <div>
              <label className="block text-sm font-medium">Pembeli</label>
              <Input {...register("pembeli")} />
            </div>
            <div>
              <label className="block text-sm font-medium">Alamat</label>
              <Input {...register("alamat")} />
            </div>
          </div>

          <hr className="my-4" />

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Nama Barang</label>
              <Input {...register("nama_barang")} />
            </div>
            <div>
              <label className="block text-sm font-medium">Coly</label>
              <Input type="number" {...register("coly")} />
            </div>
            <div>
              <label className="block text-sm font-medium">Qty</label>
              <Input type="number" {...register("qty_isi")} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Nama Isi</label>
              <Input {...register("nama_isi")} />
            </div>
            <div>
              <label className="block text-sm font-medium">Harga</label>
              <Input type="number" {...register("harga")} />
            </div>
            <div className="flex items-end">
              <Button type="button" className="w-full flex items-center gap-2">
                <PlusIcon size={16} /> Add
              </Button>
            </div>
          </div>

          <table className="w-full border mt-4 text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Nama Barang</th>
                <th className="p-2">Coly</th>
                <th className="p-2">Isi</th>
                <th className="p-2">Jumlah Barang</th>
                <th className="p-2">Harga</th>
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t bg-gray-100">
                <td className="p-2" colSpan={5}>Jumlah</td>
                <td className="p-2">0</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end gap-2 mt-4">
            <Button className="flex items-center gap-2">
              <PrinterIcon size={16} /> Print
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <SaveIcon size={16} /> Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PostAllNota;
