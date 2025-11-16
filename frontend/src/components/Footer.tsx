export default function Footer() {
  return (
    <footer className="bg-neutral-800 mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-neutral-300 text-sm">
          © {new Date().getFullYear()} RP. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
