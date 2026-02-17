import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Form Area */}
            <div className="relative flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:flex-none lg:px-20 xl:px-24 bg-background">
                <Link href="/" className="absolute top-8 left-8 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-muted h-9 px-4 py-2 text-black cursor-pointer">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10">
                        <Link href="/" className="flex items-center gap-2 mb-8">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-2xl">
                                L
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-primary">
                                Legal Sahay
                            </span>
                        </Link>
                    </div>
                    {children}
                    <div className="mt-8 text-center text-xs text-muted-foreground">
                        By continuing, you agree to our{" "}
                        <Link href="/terms" className="underline hover:text-primary">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline hover:text-primary">
                            Privacy Policy
                        </Link>
                        .
                    </div>
                </div>
            </div>

            {/* Right Side - Branding Area (Hidden on mobile) */}
            <div className="relative hidden w-0 flex-1 lg:block bg-primary">
                <div className="absolute inset-0 h-full w-full object-cover">
                    {/* Abstract pattern or image overlay */}
                    <div className="absolute inset-0 bg-primary bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-foreground/10 to-transparent" />
                    <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:30px_30px]" />
                </div>
                <div className="relative z-10 flex h-full flex-col justify-center px-12 text-primary-foreground">
                    <h2 className="mb-6 text-4xl font-extrabold tracking-tight">
                        Legal Documents <br /> Made Easy
                    </h2>
                    <p className="mb-8 text-lg opacity-90">
                        Draft, Sign, Stamp, and Deliver your legal documents with ease.
                        #DigitalIndia 🇮🇳
                    </p>

                    <div className="space-y-4">
                        {[
                            "Over 100k+ Happy Customers",
                            "Legally Valid Documents",
                            "Secure & Confidential"
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <div className="rounded-full bg-white/20 p-1">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <span className="font-medium">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex items-center gap-4">
                        {/* Avatar Pile Placeholder */}
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-10 w-10 rounded-full border-2 border-primary bg-white/20" />
                            ))}
                        </div>
                        <div className="text-sm font-medium">Join thousands of users</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
