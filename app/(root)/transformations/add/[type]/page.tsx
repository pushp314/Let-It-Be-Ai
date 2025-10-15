
'use client'
import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React from 'react'

const AddTransformationTypePage = ({ params: { type } }: SearchParamProps) => {
  const { data: session } = useSession();
  const transformation = transformationTypes[type];

  if (!session) redirect('/sign-in')

  return (
    <>
      <Header 
      title={transformation.title} 
      subtitle={transformation.subTitle} 
      />

      <section className='mt-10'>
        <TransformationForm
          action='Add'
          userId={session.user.id}
          type= { transformation.type as TransformationTypeKey }
          creditBalance={session.user.creditBalance}
        />
      </section>
    </>

  )
}

export default AddTransformationTypePage
