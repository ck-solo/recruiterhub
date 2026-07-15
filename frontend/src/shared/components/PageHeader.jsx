function PageHeader({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-2xl font-black text-slate-800 dark:text-white">{title}</h1>
      {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}

export default PageHeader;
