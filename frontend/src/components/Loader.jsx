const Loader = ({ text = "Loading..." }) => (
  <div className="flex min-h-[120px] items-center justify-center rounded-lg border border-slate-200 bg-white">
    <p className="text-sm font-medium text-slate-500">{text}</p>
  </div>
);

export default Loader;
