'use client'
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast"; // Import useToast

import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { plans } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import Checkout from "@/components/shared/Checkout";
import { IUser } from "@/lib/database/models/user.model";
import { env } from "@/lib/env"; // Import env

const Credits = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast(); // Initialize useToast

  useEffect(() => {
    // Add the MONGODB_URI check
    if (!env.MONGODB_URI) {
      toast({ title: "Error", description: "MONGODB_URI is not configured. Please set it in your environment variables." });
      redirect("/");
      return;
    }

    if (status === 'loading') return;
    if (!session) {
      redirect("/sign-in");
      return; // Add return to stop execution
    }

    const fetchUser = async () => {
      if (session?.user) {
        const sessionUser = session.user as { id: string };
        try {
          const fetchedUser = await getUserById(sessionUser.id);
          setUser(fetchedUser);
        } catch (error) {
            console.error("Failed to fetch user:", error);
            toast({ title: "Error", description: "Failed to fetch user data. Please try again later.", variant: "destructive" });
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [session, status, toast]); // Add toast to dependency array

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found.</div>; 
  }

  return (
    <>
      <Header
        title="Buy Credits"
        subtitle="Choose a credit package that suits your needs!"
      />

      <section>
        <ul className="credits-list">
          {plans.map((plan) => (
            <li key={plan.name} className="credits-item">
              <div className="flex-center flex-col gap-3">
                <Image src={plan.icon} alt="check" width={50} height={50} />
                <p className="p-20-semibold mt-2 text-purple-500">
                  {plan.name}
                </p>
                <p className="h1-semibold text-dark-600">${plan.price}</p>
                <p className="p-16-regular">{plan.credits} Credits</p>
              </div>

              {/* Inclusions */}
              <ul className="flex flex-col gap-5 py-9">
                {plan.inclusions.map((inclusion) => (
                  <li
                    key={plan.name + inclusion.label}
                    className="flex items-center gap-4"
                  >
                    <Image
                      src={`/assets/icons/${
                        inclusion.isIncluded ? "check.svg" : "cross.svg"
                      }`}
                      alt="check"
                      width={24}
                      height={24}
                    />
                    <p className="p-16-regular">{inclusion.label}</p>
                  </li>
                ))}
              </ul>

              {plan.name === "Free" ? (
                <Button variant="outline" className="credits-btn">
                  Free Consumable
                </Button>
              ) : (
                <Checkout
                  plan={plan.name}
                  amount={plan.price}
                  credits={plan.credits}
                  buyerId={user._id}
                />
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Credits;
