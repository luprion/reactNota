import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Swal from "sweetalert2";
import { useCreateDetailNota } from "@/services/mutations";
import axios from "axios";

const MAX_DETAILS = 10;

const AddDetailPage = () => {
  const { notaId } = useParams();
  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: {
      details: [{ nama_barang: "", coly: 1, qty_isi: 1, nama_isi: "", harga: 0 }],
    },
  });

  const { control, handleSubmit, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "details" });
  const { mutate } = useCreateDetailNota();

  // Watch all field values
  const details = watch("details");

  // Calculate total jumlah & total coly for nota
  const totalColy = details.reduce((sum, d) => sum + (d.coly || 0), 0);
  const totalNota = details.reduce(
    (sum, d) => sum + ((d.coly || 0) * (d.qty_isi || 0) * (d.harga || 0)),
    0
  );

  const onSubmit = async (data) => {
    const formattedData = data.details.map((detail) => ({
      nota_id: notaId,
      ...detail,
      jumlah: detail.coly * detail.qty_isi,
      total: detail.coly * detail.qty_isi * detail.harga,
    }));

    mutate(formattedData, {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Detail nota created successfully!",
          confirmButtonText: "Ok",
        }).then(() => navigate(`/nota/${notaId}/detail-nota`));
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: error.response?.data,
            confirmButtonText: "Ok",
          });
        }
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-3xl p-6 bg-white shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add Detail Nota</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Nama Barang</th>
                    <th className="p-2 border">Coly</th>
                    <th className="p-2 border">Qty Isi</th>
                    <th className="p-2 border">Nama Isi</th>
                    <th className="p-2 border">Harga</th>
                    <th className="p-2 border">Jumlah</th>
                    <th className="p-2 border">Total</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={field.id}>
                      <td className="p-2 border">
                        <Input {...form.register(`details.${index}.nama_barang`)} required />
                      </td>
                      <td className="p-2 border">
                        <Input
                          type="number"
                          min="1"
                          {...form.register(`details.${index}.coly`, {
                            onChange: (e) => setValue(`details.${index}.jumlah`, e.target.value * details[index].qty_isi),
                          })}
                          required
                        />
                      </td>
                      <td className="p-2 border">
                        <Input
                          type="number"
                          min="1"
                          {...form.register(`details.${index}.qty_isi`, {
                            onChange: (e) => setValue(`details.${index}.jumlah`, e.target.value * details[index].coly),
                          })}
                          required
                        />
                      </td>
                      <td className="p-2 border">
                        <Input {...form.register(`details.${index}.nama_isi`)} required />
                      </td>
                      <td className="p-2 border">
                        <Input
                          type="number"
                          min="0"
                          {...form.register(`details.${index}.harga`, {
                            onChange: (e) => setValue(`details.${index}.total`, e.target.value * details[index].jumlah),
                          })}
                          required
                        />
                      </td>
                      <td className="p-2 border">
                        <Input type="number" value={details[index].coly * details[index].qty_isi} readOnly />
                      </td>
                      <td className="p-2 border">
                        <Input type="number" value={details[index].coly * details[index].qty_isi * details[index].harga} readOnly />
                      </td>
                      <td className="p-2 border text-center">
                        <Button variant="destructive" onClick={() => remove(index)} disabled={fields.length === 1}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                type="button"
                onClick={() => append({ nama_barang: "", coly: 1, qty_isi: 1, nama_isi: "", harga: 0 })}
                disabled={fields.length >= MAX_DETAILS}
              >
                + Add Detail
              </Button>
              <div className="text-right">
                <p>Total Coly: {totalColy}</p>
                <p>Total Nota: Rp {totalNota.toLocaleString()}</p>
              </div>
            </div>

            <Button type="submit" className="w-full text-lg mt-4">
              Submit Details
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDetailPage;
