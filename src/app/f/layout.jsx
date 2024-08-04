import Navbar from "@/components/navbar";
import { Toaster } from "sonner";

export default function layout({children}) {
  return (
    <>
    <Toaster position="top-center" richColors/>
    <Navbar/>
    {children}
    </>
  )
}
