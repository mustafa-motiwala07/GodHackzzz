import Link from "next/link";

export default function Navbar() {
    return (
        <header className="fixed top-0 left-0 z-50 w-full bg-background shadow">
      <nav className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <Link href="#" className="text-lg font-medium" prefetch={false}>
          Home
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="#" className="text-sm font-medium transition-colors hover:text-primary" prefetch={false}>
            Manage PDF
          </Link>
        </div>
      </nav>
    </header>
    )
}