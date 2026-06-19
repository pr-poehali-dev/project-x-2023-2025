import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const BOOKINGS_URL = "https://functions.poehali.dev/e1bbd3dc-4869-45cb-8f1d-d59b858318d6";
const ADMIN_PASSWORD = "valday2024";

type Booking = {
  id: number;
  house_title: string;
  house_location: string;
  guest_name: string;
  guest_phone: string;
  date_from: string;
  date_to: string;
  nights: number;
  total_amount: number;
  prepayment: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
};

const STATUS_LABELS = {
  pending: "Ожидает",
  confirmed: "Подтверждено",
  cancelled: "Отменено",
};

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function Admin() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setPwError(true);
    }
  }

  async function loadBookings() {
    setLoading(true);
    try {
      const res = await fetch(BOOKINGS_URL);
      const data = await res.json();
      setBookings(data.bookings || []);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: string) {
    setUpdatingId(id);
    try {
      await fetch(`${BOOKINGS_URL}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await loadBookings();
    } finally {
      setUpdatingId(null);
    }
  }

  useEffect(() => {
    if (authed) loadBookings();
  }, [authed]);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    revenue: bookings
      .filter((b) => b.status === "confirmed")
      .reduce((s, b) => s + b.total_amount, 0),
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-sm shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold uppercase tracking-wide mb-1">ValdayEcoLife</h1>
            <p className="text-neutral-500 text-sm">Панель администратора</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-neutral-500 mb-1 block">Пароль</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPwError(false); }}
                className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="Введите пароль"
              />
              {pwError && <p className="text-red-500 text-xs mt-1">Неверный пароль</p>}
            </div>
            <button
              type="submit"
              className="bg-black text-white py-2 text-sm uppercase tracking-wide hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-black text-sm uppercase tracking-wide font-bold">ValdayEcoLife — Админ</div>
          <div className="flex items-center gap-4">
            <button
              onClick={loadBookings}
              className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors text-sm cursor-pointer"
            >
              <Icon name="RefreshCw" size={14} />
              Обновить
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors text-sm cursor-pointer"
            >
              <Icon name="ArrowLeft" size={14} />
              На сайт
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8 tracking-tight">Все бронирования</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-neutral-200 p-5">
            <p className="text-xs uppercase tracking-wide text-neutral-400 mb-1">Всего броней</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white border border-neutral-200 p-5">
            <p className="text-xs uppercase tracking-wide text-neutral-400 mb-1">Ожидают</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white border border-neutral-200 p-5">
            <p className="text-xs uppercase tracking-wide text-neutral-400 mb-1">Подтверждено</p>
            <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white border border-neutral-200 p-5">
            <p className="text-xs uppercase tracking-wide text-neutral-400 mb-1">Выручка</p>
            <p className="text-3xl font-bold">{stats.revenue.toLocaleString("ru-RU")} ₽</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-neutral-400">
            <Icon name="Loader2" size={32} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 text-neutral-400">
            <Icon name="Inbox" size={48} />
            <p className="mt-4 text-lg">Броней пока нет</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white border border-neutral-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-bold text-lg text-neutral-900">#{b.id} {b.house_title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[b.status]}`}>
                        {STATUS_LABELS[b.status]}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <Icon name="MapPin" size={13} />
                        {b.house_location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon name="User" size={13} />
                        {b.guest_name}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon name="Phone" size={13} />
                        {b.guest_phone}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon name="Calendar" size={13} />
                        {b.date_from} — {b.date_to} ({b.nights} {b.nights === 1 ? "ночь" : b.nights < 5 ? "ночи" : "ночей"})
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon name="Banknote" size={13} />
                        Итого: <span className="font-semibold">{b.total_amount.toLocaleString("ru-RU")} ₽</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon name="CreditCard" size={13} />
                        Предоплата: <span className="font-semibold text-green-700">{b.prepayment.toLocaleString("ru-RU")} ₽</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-3">Заявка от {b.created_at}</p>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 md:min-w-[140px]">
                    {b.status !== "confirmed" && (
                      <button
                        onClick={() => updateStatus(b.id, "confirmed")}
                        disabled={updatingId === b.id}
                        className="bg-green-600 text-white px-4 py-2 text-xs uppercase tracking-wide hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Подтвердить
                      </button>
                    )}
                    {b.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(b.id, "cancelled")}
                        disabled={updatingId === b.id}
                        className="border border-red-300 text-red-600 px-4 py-2 text-xs uppercase tracking-wide hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Отменить
                      </button>
                    )}
                    {b.status === "cancelled" && (
                      <button
                        onClick={() => updateStatus(b.id, "pending")}
                        disabled={updatingId === b.id}
                        className="border border-neutral-300 text-neutral-600 px-4 py-2 text-xs uppercase tracking-wide hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Восстановить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
