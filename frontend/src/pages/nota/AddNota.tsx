import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateNota } from "@/services/mutations";
import Swal from "sweetalert2"
import axios from "axios";

const AddNotaPage = () => {
  const { register, handleSubmit } = useForm();
  const { mutate, isLoading } = useCreateNota();

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Team created successfully!",
          confirmButtonText: "Ok",
        });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: error.response?.data ,
            confirmButtonText: "Ok",
          });
        }      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Add Nota</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>No Nota</Label>
              <Input {...register("no_nota")} type="text" placeholder="Enter No Nota" required />
            </div>
            <div>
              <Label>Tanggal</Label>
              <Input {...register("tanggal")} type="date" required />
            </div>
            <div>
              <Label>Pembeli</Label>
              <Input {...register("pembeli")} type="text" placeholder="Enter Buyer Name" required />
            </div>
            <div>
              <Label>Alamat</Label>
              <Input {...register("alamat")} type="text" placeholder="Enter Address" required />
            </div>
            <div>
              <Label>Total Harga</Label>
              <Input {...register("total_harga")} type="number" placeholder="Enter Total Price" required />
            </div>
            <div>
              <Label>Total Coly</Label>
              <Input {...register("total_coly")} type="number" placeholder="Enter Total Coly" required />
            </div>
            <div>
              <Label>Jatuh Tempo</Label>
              <Input {...register("jt_tempo")} type="date" required />
            </div>
            <div>
              <Label>Status</Label>
              <Input {...register("status")} type="number" placeholder="Enter Status" required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Nota"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNotaPage;
