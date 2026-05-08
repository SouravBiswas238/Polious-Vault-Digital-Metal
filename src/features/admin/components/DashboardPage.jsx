import { Users, Activity, CreditCard, CheckCircle2, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";
import { formatUSD } from "../constants";

export default function DashboardPage({ users, opsToday }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Overview</h2>
        <p className="text-sm text-slate-400 mt-0.5">Welcome back, Admin.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Users"     value={users.length} icon={Users}        iconColor="text-blue-500"    iconBg="bg-blue-50"    />
        <StatCard label="Active Sessions" value="1"            icon={Activity}     iconColor="text-green-500"   iconBg="bg-green-50"   />
        <StatCard label="Ops Today"       value={opsToday}     icon={CreditCard}   iconColor="text-purple-500"  iconBg="bg-purple-50"  />
        <StatCard label="System Status"   value="Online"       icon={CheckCircle2} iconColor="text-emerald-500" iconBg="bg-emerald-50" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-500" /> Recent Registrations
          </h3>
          <span className="text-xs text-slate-400">{users.length} total</span>
        </div>

        {users.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-400">No users yet.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {users.slice(0, 5).map((u) => (
              <div key={u._id} className="px-6 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {(u.firstName?.[0] || u.email?.[0] || "?").toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {u.firstName || u.lastName
                        ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
                        : "Unnamed User"}
                    </p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${u.balance > 0 ? "text-emerald-600" : "text-slate-300"}`}>
                  {formatUSD(u.balance)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
