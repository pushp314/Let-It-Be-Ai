'use client'
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from 'react'; // FIX: Import useEffect and useState

import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { plans } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import Checkout from "@/components/shared/Checkout";
import { IUser } from "@/lib/database/models/user.model"; // FIX: Import the IUser type

// FIX: Remove 'async' and convert to a proper client component
const Credits = () => {
  const { data: session, status } = useSession();
  // FIX: Add state to hold the user and loading status
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  // FIX: Redirect or fetch user data in a useEffect hook based on session status
  useEffect(() => {
    if (status === 'loading') return; // Wait until session is loaded
    if (!session) {
      redirect("/sign-in");
    }

    const fetchUser = async () => {
      if (session?.user) {
        // FIX: Cast the session user to include your custom 'id' property
        const sessionUser = session.user as { id: string };
        const fetchedUser = await getUserById(sessionUser.id);
        setUser(fetchedUser);
      }
      setLoading(false);
    };

    fetchUser();
  }, [session, status]);

  // FIX: Show a loading state while fetching user data
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
                  // FIX: Use the user ID from the state variable
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
