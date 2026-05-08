export default function PlaceholderPage({ title, description, icon: Icon }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-400 mt-0.5">{description}</p>
      </div>
      <div className="bg-white rounded-xl border border-dashed border-slate-200 shadow-sm p-16 flex flex-col items-center text-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <Icon className="h-8 w-8 text-slate-300" />
        </div>
        <div>
          <p className="text-base font-semibold text-slate-500">Coming Soon</p>
          <p className="text-sm text-slate-400 mt-1">This section is under development.</p>
        </div>
      </div>
    </div>
  );
}
