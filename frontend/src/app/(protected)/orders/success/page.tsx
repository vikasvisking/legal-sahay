import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] p-4 animate-in fade-in zoom-in duration-500">
            <Card className="w-full max-w-md text-center border-emerald-100 shadow-lg shadow-emerald-50">
                <CardHeader className="flex flex-col items-center space-y-4 pb-2">
                    <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-emerald-950">Payment Successful!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-slate-600">
                        Your E-Stamp order has been placed successfully.
                        We will process your request shortly.
                    </p>
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                        <p className="text-sm text-emerald-800 font-medium">Order ID: #EST-{Math.floor(Math.random() * 100000)}</p>
                        <p className="text-xs text-emerald-600 mt-1">Save this for your reference</p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 pt-2">
                    <Link href="/dashboard" className="w-full">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/estamps/create" className="w-full">
                        <Button variant="ghost" className="w-full">
                            Create Another E-Stamp
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
