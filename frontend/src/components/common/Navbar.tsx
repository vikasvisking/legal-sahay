"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useUserStore } from "@/store/user-store";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, logout } = useUserStore();

    const handleLogout = () => {
        logout();
        toast.info("Logged out", {
            description: "You have been successfully logged out.",
        });
    };

    const navLinks = [
        { name: "Services", href: "/services" },
        { name: "Orders", href: "/orders" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
                        L
                    </div>
                    <span className="text-xl font-bold tracking-tight text-primary">
                        Legal Sahay
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                                        <User className="h-4 w-4" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user?.first_name || "User"}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.phone_number}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button>Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="flex flex-col gap-6 mt-6">
                                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                                        L
                                    </div>
                                    <span className="text-lg font-bold">Legal Sahay</span>
                                </Link>
                                <div className="flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="text-base font-medium text-muted-foreground hover:text-primary"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-3 mt-4">
                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full">Get Started</Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
