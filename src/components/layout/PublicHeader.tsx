'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Sparkles, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '@/features/auth/lib/auth-provider';
import { useState, useEffect } from 'react';

export function PublicHeader() {
    const { isAuthenticated } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navLinks = [
        { label: 'Fonctionnalités', href: '#features' },
        { label: 'Tarifs', href: '#pricing' },
        { label: 'FAQ', href: '#faq' },
    ];

    return (
        <header
            role="banner"
            className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm"
        >
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 text-gray-900 hover:opacity-80 transition-opacity">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">MILELE</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {!mounted ? (
                            // Show placeholder during SSR to prevent hydration mismatch
                            <>
                                <Button variant="ghost" asChild className="text-gray-700 hover:bg-gray-100">
                                    <Link href="/login">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Connexion
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                                >
                                    <Link href="/register">Commencer</Link>
                                </Button>
                            </>
                        ) : isAuthenticated ? (
                            <Button
                                asChild
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                            >
                                <Link href="/dashboard">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" asChild className="text-gray-700 hover:bg-gray-100">
                                    <Link href="/login">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Connexion
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                                >
                                    <Link href="/setup">Commencer</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon" aria-label="Menu">
                                <Menu className="h-6 w-6 text-gray-900" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] bg-white border-gray-200">
                            <div className="flex flex-col gap-6 mt-8">
                                <Link href="/" className="flex items-center gap-2 text-gray-900">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold">MILELE</span>
                                </Link>

                                <nav className="flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors py-2"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>

                                <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                                    {!mounted ? (
                                        // Show placeholder during SSR to prevent hydration mismatch
                                        <>
                                            <Button variant="outline" asChild className="w-full border-gray-300 text-gray-700">
                                                <Link href="/login">
                                                    <LogIn className="mr-2 h-4 w-4" />
                                                    Connexion
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                                            >
                                                <Link href="/register">Commencer</Link>
                                            </Button>
                                        </>
                                    ) : isAuthenticated ? (
                                        <Button
                                            asChild
                                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                                        >
                                            <Link href="/dashboard">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                Dashboard
                                            </Link>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button variant="outline" asChild className="w-full border-gray-300 text-gray-700">
                                                <Link href="/login">
                                                    <LogIn className="mr-2 h-4 w-4" />
                                                    Connexion
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                                            >
                                                <Link href="/register">Commencer</Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
