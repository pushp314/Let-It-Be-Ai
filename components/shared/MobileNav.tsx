"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { navLinks } from '@/constants'
import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'

const MobileNav = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

  return (
    <header className="header">
        <Link href='/' className="flex items-center gap-2 md:py-2">
            <Image
                src='/assets/images/logo-text.svg'
                alt='logo'
                width={180}
                height={28}
            />
        </Link>
        <nav className="flex gap-2">
            {session ? (
                <>
                    <button onClick={() => signOut()} className="button">Logout</button>
                    <Sheet>
                        <SheetTrigger>
                            <Image
                                src="/assets/icons/menu.svg"
                                alt="menu"
                                width={32}
                                height={32}
                                className="cursor-pointer" 
                            />

                        </SheetTrigger>
                        <SheetContent className="sheet-content sm:w-64">
                            <>
                                <Image
                                    src="/assets/images/logo-text.svg"
                                    alt="logo"
                                    width={152}
                                    height={23}
                                />

                                
                                <ul className='header-nav-elements'>
                                {navLinks.map((link) => {
                                    const isActive = link.route === pathname

                                    return(
                                        <li 
                                            className={`${isActive && 'gradient-text'} p-18 flex whitespace-nowrap text-dark-700`}
                                            key={link.route} >
                                            <Link className='sidebar-link cursor-pointer' href={link.route}>
                                                <Image
                                                    src={link.icon}
                                                    alt='logo'
                                                    width={24}
                                                    height={24}                                                
                                                    />
                                                {link.label}
                                            </Link>
                                                                        
                                        </li>
                                    )
                                })}
                            </ul>
                            </>
                            
                        </SheetContent>
                    </Sheet>
                </>
            ) : (
                <Button asChild className='button bg-purple-gradient bg-cover'>
                    <Link href="/api/auth/signin">Login</Link>
                </Button>
            )}
        </nav>
    </header>
  )
}

export default MobileNav