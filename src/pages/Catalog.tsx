import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

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

export default function Catalog() {
  const navigate = useNavigate();

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
          <div className="text-black text-sm uppercase tracking-wide font-bold">staylux</div>
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
                  <button className="bg-black text-white px-5 py-2 text-sm uppercase tracking-wide transition-all duration-300 hover:bg-neutral-700 cursor-pointer">
                    Забронировать
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
