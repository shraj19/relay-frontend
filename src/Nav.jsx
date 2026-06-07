
function Nav() {
  return (
    <nav className="w-full h-16 flex items-center justify-between px-4 bg-[#0F172A]">
      <div className="text-white text-lg font-bold">Relay</div>
      <div className="flex space-x-4">
        <a href="#" className="text-gray-300 hover:text-white border-2 p-2 rounded-4xl bg-slate-700" >Sign In</a>
      </div>
    </nav>
  );
}

export default Nav;