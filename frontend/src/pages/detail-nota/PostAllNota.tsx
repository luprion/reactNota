import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PlusIcon, PrinterIcon, SaveIcon } from "lucide-react";
import { format } from "date-fns";
import { useCreateNota } from "@/services/mutations";

const PostAllNota = () => {
  const currentDate = new Date();
  const formattedNoNota = format(currentDate, "yyyyMMddHHmmss");
  const formatDate = (date) => format(date, "yyyy-MM-dd");

  const { mutate: createNota, isPending } = useCreateNota();

  const form = useForm({
    defaultValues: {
      no_nota: formattedNoNota,
      tanggal: formatDate(new Date()),
      jt_tempo: "",
      pembeli: "",
      alamat: "",
      details: [{ nama_barang: "", coly: "", qty_isi: "", nama_isi: "", harga: "" }],
    },
  });

  const { register, handleSubmit, control, watch } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "details" });

  const details = watch("details", []);

  const totalColy = details.reduce((sum, d) => sum + (parseInt(d.coly) || 0), 0);
  const totalHarga = details.reduce(
    (sum, d) => sum + (parseInt(d.coly) * parseInt(d.qty_isi) * parseFloat(d.harga) || 0),
    0
  );

  const addDetail = () => {
    append({ nama_barang: "", coly: "", qty_isi: "", nama_isi: "", harga: "" });
  };

  const onSubmit = (data) => {
    console.log(data.details, 'apakah ada?');
    
    const formattedData = {
      ...data,
      total_harga: totalHarga,
      total_coly: totalColy,
      details: data.details.map((d) => ({
        ...d,
        nama_barang: d.nama_barang,
        coly: parseInt(d.coly),
        qty_isi: parseInt(d.qty_isi),
        harga: parseFloat(d.harga),
        jumlah: parseInt(d.coly) * parseInt(d.qty_isi),
        total: parseInt(d.coly) * parseInt(d.qty_isi) * parseFloat(d.harga),
      })),
    };
    console.log(formattedData, 'payload');
    
    createNota(formattedData);
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
            <Input type="date" {...register("tanggal")} />
            <Input type="date" {...register("jt_tempo")} />
            <Input {...register("pembeli")} placeholder="Pembeli" />
            <Input {...register("alamat")} placeholder="Alamat" />
          </div>

          <hr className="my-4" />

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-5 gap-4 mb-4">
              <Input {...register(`details.${index}.nama_barang`)} placeholder="Nama Barang" />
              <Input type="number" {...register(`details.${index}.coly`)} placeholder="Coly" />
              <Input type="number" {...register(`details.${index}.qty_isi`)} placeholder="Qty" />
              <Input {...register(`details.${index}.nama_isi`)} placeholder="Nama Isi" />
              <Input type="number" {...register(`details.${index}.harga`)} placeholder="Harga" />
              <Button type="button" onClick={() => remove(index)}>Hapus</Button>
            </div>
          ))}

          <Button type="button" onClick={addDetail} className="w-full flex items-center gap-2">
            <PlusIcon size={16} /> Add
          </Button>

          <table className="w-full border mt-4 text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Total Coly</th>
                <th className="p-2">Total Harga</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t bg-gray-100">
                <td className="p-2">{totalColy}</td>
                <td className="p-2">{totalHarga}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end gap-2 mt-4">
            <Button className="flex items-center gap-2">
              <PrinterIcon size={16} /> Print
            </Button>
            <Button type="submit" className="flex items-center gap-2" disabled={isPending}>
              <SaveIcon size={16} /> {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PostAllNota;
