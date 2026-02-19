import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function OrderFailedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] p-4 animate-in fade-in zoom-in duration-500">
            <Card className="w-full max-w-md text-center border-red-100 shadow-lg shadow-red-50">
                <CardHeader className="flex flex-col items-center space-y-4 pb-2">
                    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                        <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-950">Payment Failed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-slate-600">
                        Unfortunately, your transaction could not be completed.
                        Please try again or contact support if the issue persists.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 pt-2">
                    <Link href="/estamps/create" className="w-full">
                        <Button variant="default" className="w-full bg-red-600 hover:bg-red-700">
                            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                        </Button>
                    </Link>
                    <Link href="/dashboard" className="w-full">
                        <Button variant="ghost" className="w-full">
                            Cancel and Go to Dashboard
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
