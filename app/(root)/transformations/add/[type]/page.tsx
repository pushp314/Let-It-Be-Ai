
'use client'
import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React from 'react'

// FIX: Define TransformationTypeKey to be one of the keys from the transformationTypes object.
// This ensures that the 'type' param is always a valid transformation type.
type TransformationTypeKey = keyof typeof transformationTypes;

// FIX: Define the SearchParamProps interface. This should ideally be in a global types file (e.g., types/index.d.ts).
interface SearchParamProps {
  params: { type: TransformationTypeKey };
}

const AddTransformationTypePage = ({ params: { type } }: SearchParamProps) => {
  const { data: session } = useSession();
  const transformation = transformationTypes[type];

  // FIX: Redirect if the session or the user object within the session is missing.
  if (!session || !session.user) redirect('/sign-in')

  // NOTE: For a permanent fix, you should augment the Next-Auth session type by creating a
  // 'next-auth.d.ts' file and adding the custom user properties like 'id' and 'creditBalance'.
  const user = session.user as { id: string; creditBalance: number; };

  return (
    <>
      <Header 
      title={transformation.title} 
      subtitle={transformation.subTitle} 
      />

      <section className='mt-10'>
        <TransformationForm
          action='Add'
          // FIX: Use the 'id' and 'creditBalance' from the correctly typed user object.
          userId={user.id}
          type= { transformation.type as TransformationTypeKey }
          creditBalance={user.creditBalance}
        />
      </section>
    </>

  )
}

export default AddTransformationTypePage
