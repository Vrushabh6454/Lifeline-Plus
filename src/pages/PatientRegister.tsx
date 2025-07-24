import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

type PatientFormData = {
  name: string;
  email: string;
  password: string;
  mobile: string;
  age: string;
  gender: string;
};

const PatientRegister = () => {
  const { register, handleSubmit, reset } = useForm<PatientFormData>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: PatientFormData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patient/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast({
          title: "✅ Patient Registered",
          description: "Registration successful.",
        });
        reset();
        navigate("/login/patient");
      } else {
        throw new Error(result.error || "Registration failed");
      }
    } catch (err: any) {
      toast({
        title: "❌ Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl">Patient Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input {...register("name")} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" {...register("email")} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" {...register("password")} required />
            </div>
            <div>
              <Label>Mobile Number</Label>
              <Input type="text" {...register("mobile")} required />
            </div>
            <div>
              <Label>Age</Label>
              <Input type="number" {...register("age")} required />
            </div>
            <div>
              <Label>Gender</Label>
              <Input type="text" {...register("gender")} required />
            </div>
            
           

            <Button type="submit" className="w-full">Register</Button>
            <a href="/login/patient" className="text-sm text-muted-foreground hover:underline"
                onClick={(e) => {
                    e.preventDefault();
                    navigate("/login/patient");
                }}>Already have an account? Login</a>
          

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRegister;
