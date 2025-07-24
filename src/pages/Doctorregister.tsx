import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom"; // ✅ Import this

type DoctorFormData = {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
  specialization: string;
  experience: string;
  hospital: string;
};

const DoctorRegister = () => {
  const { register, handleSubmit, reset } = useForm<DoctorFormData>();
  const { toast } = useToast();
  const navigate = useNavigate(); // ✅ Setup navigation

  const onSubmit = async (data: DoctorFormData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast({
          title: "✅ Registered Successfully",
          description: "Redirecting to login...",
        });
        reset();

        // ✅ Redirect after 1 second
        setTimeout(() => {
          navigate("/login/doctor");
        }, 1000);
      } else {
        throw new Error(result.error || "Registration failed");
      }
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Doctor Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register("fullName")} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" {...register("email")} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" {...register("password")} required />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" {...register("mobile")} required />
            </div>
            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" {...register("specialization")} required />
            </div>
            <div>
              <Label htmlFor="hospital">Hospital/Clinic Name</Label>
              <Input id="hospital" {...register("hospital")} required />
            </div>
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input type="number" id="experience" {...register("experience")} required />
            </div>
            <Button type="submit" className="w-full max-w-xl">Register Doctor</Button>
            <a
              href="/login/doctor"
              className="text-sm text-muted-foreground hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login/doctor");
              }}
            >
              Already Registered? Login
            </a>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorRegister;
