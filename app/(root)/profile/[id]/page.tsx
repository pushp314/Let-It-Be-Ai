
'use client'
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { Collection } from "@/components/shared/Collection";
import Header from "@/components/shared/Header";
import { getUserImages } from "@/lib/actions/image.actions";
import { getUserById } from "@/lib/actions/user.actions";

// FIX: Replaced SearchParamProps with a specific type definition to resolve the error.
const ProfilePage = ({ params, searchParams }: { params: { id: string }, searchParams: { [key: string]: string | string[] | undefined } }) => {
  const page = Number(searchParams?.page) || 1;
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [images, setImages] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // FIX: Cast the session user to a type that includes the 'role' property.
    const typedUser = session?.user as { role?: string };

    if (status === "authenticated" && typedUser?.role === 'admin') {
      const fetchData = async () => {
        try {
          setLoading(true);
          const fetchedUser = await getUserById(params.id);
          const fetchedImages = await getUserImages({ page, userId: fetchedUser._id });
          setUser(fetchedUser);
          setImages(fetchedImages);
        } catch (err) {
          setError("Failed to fetch user data");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (status === "authenticated" && typedUser?.role !== 'admin') {
        redirect('/')
    } else if (status === "unauthenticated") {
      redirect("/sign-in");
    }
  }, [session, status, page, params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <>
      <Header title={`${user.firstName} ${user.lastName}'s Profile`} />

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
            <h2 className="h2-bold text-dark-600">{images?.data.length}</h2>
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

export default ProfilePage;
