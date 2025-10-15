'use client'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { getImageById } from "@/lib/actions/image.actions";
import { IImage } from "@/lib/database/models/image.model";
import { IUser } from "@/lib/database/models/user.model";

// FIX: Explicitly define types to permanently resolve "Cannot find name" errors.

type SearchParamProps = {
  params: { id: string };
};

type TransformationTypeKey =
  | "restore"
  | "fill"
  | "remove"
  | "recolor"
  | "removeBackground";


const Page = ({ params: { id } }: SearchParamProps) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<IUser | null>(null);
  const [image, setImage] = useState<IImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return; // Wait until session is loaded
    if (status === 'unauthenticated') {
      redirect("/sign-in");
      return;
    }

    const fetchData = async () => {
      try {
        if (session?.user) {
            const sessionUser = session.user as { id: string };
            const fetchedUser = await getUserById(sessionUser.id);
            const fetchedImage = await getImageById(id);
            
            setUser(fetchedUser);
            setImage(fetchedImage);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!image || !user) {
    return <div>Data not found.</div>;
  }

  const transformation =
    transformationTypes[image.transformationType as TransformationTypeKey];

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Update"
          userId={user._id}
          type={image.transformationType as TransformationTypeKey}
          creditBalance={user.creditBalance}
          config={image.config}
          data={image}
        />
      </section>
    </>
  );
};

export default Page;
