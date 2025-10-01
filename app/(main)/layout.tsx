import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Header from "../../components/Header";

export default async function MainLayout({
    children,
}: {
    readonly children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        return redirect("/login");
    }
    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
}
