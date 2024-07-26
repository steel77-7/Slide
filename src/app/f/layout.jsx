import Navbar from "@/components/navbar";


export default function layout({children}) {
  return (
    <>
    <Navbar/>
    {children}
    </>
  )
}
