import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const BOOKINGS_URL = "https://functions.poehali.dev/e1bbd3dc-4869-45cb-8f1d-d59b858318d6";
const PREPAYMENT_PERCENT = 30;

const houses = [
  {
    id: 1,
    title: "Вилла у моря",
    location: "Сочи, Краснодарский край",
    price: 12000,
    guests: 6,
    rooms: 3,
    image: "/images/hously-1.png",
    tag: "Хит сезона",
  },
  {
    id: 2,
    title: "Уютный коттедж в горах",
    location: "Красная Поляна",
    price: 8500,
    guests: 4,
    rooms: 2,
    image: "/images/hously-2.png",
    tag: "Популярное",
  },
  {
    id: 3,
    title: "Панорамный дом с видом",
    location: "Геленджик",
    price: 15000,
    guests: 8,
    rooms: 4,
    image: "/images/hously-3.png",
    tag: "Премиум",
  },
  {
    id: 4,
    title: "Загородный дом с баней",
    location: "Подмосковье",
    price: 6000,
    guests: 10,
    rooms: 5,
    image: "/images/hously-4.png",
    tag: "Семейный",
  },
  {
    id: 5,
    title: "Лофт у реки",
    location: "Карелия",
    price: 9000,
    guests: 4,
    rooms: 2,
    image: "/images/hously-background.png",
    tag: "Природа",
  },
  {
    id: 6,
    title: "Современная вилла",
    location: "Крым, Ялта",
    price: 11000,
    guests: 6,
    rooms: 3,
    image: "/images/exterior.png",
    tag: "Новинка",
  },
];

type House = typeof houses[0];

interface BookingModalProps {
  house: House;
  onClose: () => void;
}

function BookingModal({ house, onClose }: BookingModalProps) {
  const [form, setForm] = useState({ name: "", phone: "", dateFrom: "", dateTo: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nights =
    form.dateFrom && form.dateTo
      ? Math.max(
          0,
          Math.round(
            (new Date(form.dateTo).getTime() - new Date(form.dateFrom).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const total = nights * house.price;
  const prepayment = Math.round(total * PREPAYMENT_PERCENT / 100);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(BOOKINGS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          house_id: house.id,
          house_title: house.title,
          house_location: house.location,
          house_price: house.price,
          guest_name: form.name,
          guest_phone: form.phone,
          date_from: form.dateFrom,
          date_to: form.dateTo,
          nights,
          total_amount: total,
          prepayment,
        }),
      });
      if (!res.ok) throw new Error("Ошибка сервера");
      setSent(true);
    } catch {
      setError("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-bold uppercase tracking-wide">Бронирование</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-black transition-colors cursor-pointer">
            <Icon name="X" size={20} />
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-12 text-center">
            <div className="flex justify-center mb-4 text-green-600">
              <Icon name="CheckCircle" size={48} />
            </div>
            <h3 className="text-xl font-bold mb-2">Заявка принята!</h3>
            <p className="text-neutral-500 mb-2">Мы свяжемся с вами для подтверждения.</p>
            <p className="text-sm text-neutral-400 mb-6">
              Предоплата {PREPAYMENT_PERCENT}% — <span className="font-semibold text-neutral-700">{prepayment.toLocaleString("ru-RU")} ₽</span>
            </p>
            <button
              onClick={onClose}
              className="bg-black text-white px-8 py-2 text-sm uppercase tracking-wide hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex gap-4 items-center">
              <img src={house.image} alt={house.title} className="w-16 h-16 object-cover flex-shrink-0" />
              <div>
                <p className="font-bold text-neutral-900">{house.title}</p>
                <p className="text-sm text-neutral-500 flex items-center gap-1">
                  <Icon name="MapPin" size={12} />
                  {house.location}
                </p>
                <p className="text-sm font-semibold mt-1">{house.price.toLocaleString("ru-RU")} ₽ / ночь</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-wide text-neutral-500 mb-1 block">Заезд</label>
                  <input
                    type="date"
                    required
                    value={form.dateFrom}
                    onChange={(e) => setForm({ ...form, dateFrom: e.target.value })}
                    className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-neutral-500 mb-1 block">Выезд</label>
                  <input
                    type="date"
                    required
                    value={form.dateTo}
                    onChange={(e) => setForm({ ...form, dateTo: e.target.value })}
                    className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-neutral-500 mb-1 block">Ваше имя</label>
                <input
                  type="text"
                  required
                  placeholder="Иван Иванов"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-neutral-500 mb-1 block">Телефон</label>
                <input
                  type="tel"
                  required
                  placeholder="+7 (999) 000-00-00"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              {nights > 0 && (
                <div className="bg-neutral-50 border border-neutral-200 px-4 py-3 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">
                      {nights} {nights === 1 ? "ночь" : nights < 5 ? "ночи" : "ночей"}
                    </span>
                    <span className="font-bold text-lg">{total.toLocaleString("ru-RU")} ₽</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-500">Предоплата {PREPAYMENT_PERCENT}%</span>
                    <span className="text-sm font-semibold text-green-700">{prepayment.toLocaleString("ru-RU")} ₽</span>
                  </div>
                </div>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white py-3 text-sm uppercase tracking-wide hover:bg-neutral-700 transition-colors cursor-pointer w-full mt-2 disabled:opacity-50"
              >
                {loading ? "Отправляем..." : "Отправить заявку"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function Catalog() {
  const navigate = useNavigate();
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors"
          >
            <Icon name="ArrowLeft" size={18} />
            <span className="text-sm uppercase tracking-wide">Назад</span>
          </button>
          <div className="text-black text-sm uppercase tracking-wide font-bold">ValdayEcoLife</div>
          <div className="text-sm text-neutral-500">{houses.length} домов</div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-2 tracking-tight">
          Каталог домов
        </h1>
        <p className="text-neutral-500 mb-10 text-lg">Выберите дом и забронируйте онлайн за пару минут</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {houses.map((house) => (
            <div
              key={house.id}
              className="bg-white group overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={house.image}
                  alt={house.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-black text-white text-xs uppercase tracking-wide px-3 py-1">
                  {house.tag}
                </span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-1">{house.title}</h2>
                <div className="flex items-center gap-1 text-neutral-500 text-sm mb-4">
                  <Icon name="MapPin" size={14} />
                  <span>{house.location}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Icon name="Users" size={14} />
                    <span>{house.guests} гостей</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="BedDouble" size={14} />
                    <span>{house.rooms} комнаты</span>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-neutral-900">
                      {house.price.toLocaleString("ru-RU")} ₽
                    </span>
                    <span className="text-neutral-400 text-sm"> / ночь</span>
                  </div>
                  <button
                    onClick={() => setSelectedHouse(house)}
                    className="bg-black text-white px-5 py-2 text-sm uppercase tracking-wide transition-all duration-300 hover:bg-neutral-700 cursor-pointer"
                  >
                    Забронировать
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedHouse && (
        <BookingModal house={selectedHouse} onClose={() => setSelectedHouse(null)} />
      )}
    </div>
  );
}
