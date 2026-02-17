import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                                L
                            </div>
                            <span className="text-xl font-bold tracking-tight text-primary">
                                Legal Sahay
                            </span>
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                            Simplifying legal documentation for individuals and businesses.
                            Secure, fast, and reliable.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider text-foreground">Services</h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                                    Rental Agreement
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                                    Affidavits
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                                    Legal Notices
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider text-foreground">Company</h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider text-foreground">Support</h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row text-sm text-muted-foreground">
                    <p>© 2026 Legal Sahay. All rights reserved.</p>
                    <div className="flex gap-4">
                        {/* Social links placeholder */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
