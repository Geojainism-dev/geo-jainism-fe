import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { profileFormSchema } from "@/features/auth/localAuthSchema";
import { updateProfile } from "@/features/auth/localAuthApi";
import { useAuth } from "@/features/auth/AuthContext";

const toDateInputValue = (isoString) => (isoString ? isoString.slice(0, 10) : "");

export default function AdminProfile() {
  const { user, refresh } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const initial = user?.email?.[0]?.toUpperCase();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileFormSchema),
    values: {
      name: user?.name ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      dateOfBirth: toDateInputValue(user?.dateOfBirth),
    },
  });

  const openDialog = () => {
    reset({
      name: user?.name ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      dateOfBirth: toDateInputValue(user?.dateOfBirth),
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values) => {
    try {
      await updateProfile(values);
      await refresh();
      toast.success("Profile updated");
      setDialogOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Your account details.</p>

      <Card className="mt-6 border-border/80">
        <CardContent className="flex flex-col gap-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
              {initial}
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-2 font-normal">
                {user?.role}
              </Badge>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={openDialog} className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Update your name, phone number, or date of birth.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone number</Label>
                  <Input id="phoneNumber" placeholder="+919876543210" {...register("phoneNumber")} />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-destructive">{errors.phoneNumber.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of birth</Label>
                  <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save changes"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="mt-6 border-border/80">
        <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Phone number</p>
            <p className="mt-1 text-sm text-foreground">{user?.phoneNumber || "Not set"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Date of birth</p>
            <p className="mt-1 text-sm text-foreground">
              {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not set"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Sign-in method</p>
            <p className="mt-1 text-sm text-foreground">{user?.provider === "GOOGLE" ? "Google" : "Email & password"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Member since</p>
            <p className="mt-1 text-sm text-foreground">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
