import { getAuthToken } from "@/lib/auth/session";

import Navbar from "./Navbar";

export default async function NavbarShell() {
    const token = await getAuthToken();

    return <Navbar isLoggedIn={Boolean(token)} />;
}
