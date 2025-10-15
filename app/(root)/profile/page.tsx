
'use client'
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast"

import { Collection } from "@/components/shared/Collection";
import Header from "@/components/shared/Header";
import { getUserImages } from "@/lib/actions/image.actions";
import { getUserById, deleteUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

type SearchParamProps = {
    searchParams: { [key: string]: string | string[] | undefined };
};

const Profile = ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [images, setImages] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const sessionUser = session.user as { id: string };
      const fetchData = async () => {
        try {
          setLoading(true);
          const fetchedUser = await getUserById(sessionUser.id);
          if (!fetchedUser) {
            toast({ title: "Error", description: "Could not fetch user data. The database might be offline.", variant: "destructive" });
            setError("Failed to fetch user data.");
            return;
          }
          const fetchedImages = await getUserImages({ page, userId: fetchedUser._id });
          setUser(fetchedUser);
          setImages(fetchedImages);
        } catch (err) {
          console.error("API Error:", err);
          setError("A server error occurred. Please check your database connection.");
          toast({ title: "Server Error", description: "Could not connect to the server. Please ensure your MONGODB_URL is correct.", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (status === "unauthenticated") {
      redirect("/sign-in");
    }
  }, [session, status, page, toast]);

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deleteUser(user._id);
      toast({ title: "Account deleted successfully" });
      signOut({ callbackUrl: '/' });
    } catch (err) {
      toast({ title: "Error deleting account", variant: "destructive" });
    }
  };

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <div>Redirecting to sign-in...</div>;
  }

  return (
    <>
        <div className="flex justify-between items-center">
            <Header title="Profile" />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-2">
                    <Image src="/assets/icons/settings.svg" alt="settings" width={24} height={24} />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <Dialog>
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>User Information</DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>User Information</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-2">
                            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Username:</strong> {user.username}</p>
                        </div>
                    </DialogContent>
                </Dialog>

                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>Logout</DropdownMenuItem>

                <DropdownMenuSeparator />

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>Delete Account</DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account and all your images.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

      <section className="profile">
        <div className="profile-balance">
          <p className="p-14-medium md:p-16-medium">CREDITS AVAILABLE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/coins.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{user.creditBalance}</h2>
          </div>
        </div>

        <div className="profile-image-manipulation">
          <p className="p-14-medium md:p-16-medium">IMAGE MANIPULATION DONE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/photo.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{images?.data.length || 0}</h2>
          </div>
        </div>
      </section>

      <section className="mt-8 md:mt-14">
        <Collection
          images={images?.data}
          totalPages={images?.totalPages}
          page={page}
        />
      </section>
    </>
  );
};

export default Profile;
