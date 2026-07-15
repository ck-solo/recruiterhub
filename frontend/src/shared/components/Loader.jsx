function Loader({ message = "Querying jobs database..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
      <p className="text-slate-400 text-sm font-medium">{message}</p>
    </div>
  );
}

export default Loader;
