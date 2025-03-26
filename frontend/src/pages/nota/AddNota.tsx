import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateNota } from "@/services/mutations";
import Swal from "sweetalert2";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";

const AddNotaPage = () => {
  const form = useForm();
  const { mutate, isPending } = useCreateNota();
  const navigate = useNavigate();
  
  const currentDate = new Date();
  const formattedNoNota = format(currentDate, "yyyyMMddHHmmss");
  const formatDate = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const onSubmit = (data) => {
    const formattedData = {
      no_nota: data.no_nota, 
      tanggal: formatDate(data.tanggal), 
      pembeli: data.pembeli,
      alamat: data.alamat,
      total_harga: Number(data.total_harga), 
      total_coly: Number(data.total_coly), 
      jt_tempo: formatDate(data.jt_tempo), 
    };
  
    mutate(formattedData, {
      onSuccess: () => {
        console.log(formattedData);
        
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Nota created successfully!",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed){
            navigate('/nota')
          }
        });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: error.response?.data,
            confirmButtonText: "Ok",
          });
          console.log(formattedData, "payload");
        }
      },
    });
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg p-6 bg-white shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add Nota</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="no_nota"
                defaultValue={formattedNoNota}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No Nota</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tanggal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start bg-white text-white border-gray-300 hover:bg-gray-100 hover:text-white"
                          >
                            {field.value ? format(field.value, "PPP") : "Select date"}
                            <CalendarIcon className="ml-auto h-4 w-4 text-gray-500" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border border-gray-300 shadow-md">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => form.setValue("tanggal", date)}
                          className="bg-white text-black [&_*]:!bg-white [&_*]:!text-black [&_.day-selected]:!bg-blue-500"
                        />
                        <div className="flex justify-end p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-gray-100 hover:text-white"
                            onClick={() => form.setValue("tanggal", new Date())}
                          >
                            Today
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pembeli"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pembeli</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Buyer Name" required />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Address" required />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jt_tempo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jatuh Tempo</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start bg-white text-white border-gray-300 hover:bg-gray-100 hover:text-white"
                          >
                            {field.value ? format(field.value, "PPP") : "Select date"}
                            <CalendarIcon className="ml-auto h-4 w-4 text-gray-500" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border border-gray-300 shadow-md">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => form.setValue("jt_tempo", date)}
                          className="bg-white text-black [&_*]:!bg-white [&_*]:!text-black [&_.day-selected]:!bg-blue-500"
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                defaultValue={1}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Enter Status" required />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total_coly"
                defaultValue={0}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coly</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Enter Status" required />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total_harga"
                defaultValue={0}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Enter Status" required />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg" disabled={isPending}>
                {isPending ? "Adding..." : "Add Nota"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNotaPage;
