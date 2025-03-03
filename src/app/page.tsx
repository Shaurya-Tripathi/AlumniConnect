'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  const handleContinue = ()=>{
    router.push('/login');
  }
  const handleGetStarted = ()=>{
    router.push('/enrollment');
  }
  return (
    <div>
        <div className="min-h-screen bg-black text-white">
        <header className="border-b border-border">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="text-foreground font-semibold text-2xl">
              <span className="font-bold text-blue-500">Alumni</span>
              <span className="font-light text-white">Connect</span>
            </div>
            <div className="flex items-center gap-8 text-xl">
              <li className="text-white no-underline list-none">About</li>
              <li className="text-white no-underline list-none">Features</li>
              <li className="text-white no-underline list-none">Contact</li>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-20">
          <div className="max-w-[800px] mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Connect with your college community</h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-[600px] mx-auto">
              A platform where students, faculty, and alumni come together to share knowledge, opportunities, and experiences.
            </p>
            <div style={{ display: "flex", gap: "20px" ,justifyContent:"center" }}>

            <button onClick={handleContinue} className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-blue-500 hover:text-white">Continue</button>
            &nbsp;&nbsp;&nbsp;
            <button onClick={handleGetStarted} className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-blue-500 hover:text-white">Get Started</button>

            </div>

          </div>

          <div className="mt-24 grid md:grid-cols-3 gap-8 text-center">
            <div className=" p-6 rounded-lg border bg-black ">
              <h2 className="text-xl font-semibold mb-3 text-white">Students</h2>
              <p className="text-muted-foreground text-white">Connect with peers, access resources, and discover opportunities.</p>
            </div>
            <div className="p-6 rounded-lg border bg-black">
              <h2 className="text-xl font-semibold mb-3">Faculty</h2>
              <p className="text-muted-foreground text-white">Share knowledge and guide students in their academic journey.</p>
            </div>
            <div className="p-6 rounded-lg border bg-black">
              <h2 className="text-xl font-semibold mb-3">Alumni</h2>
              <p className="text-muted-foreground text-white">Stay connected and give back to your college community.</p>
            </div>
          </div>
        </main>

        <footer className="border-t border-border mt-20">
          <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
            © {new Date().getFullYear()} Alumni-Connect. All rights reserved.
          </div>
        </footer>
      </div>

      
    </div>
  );
}
