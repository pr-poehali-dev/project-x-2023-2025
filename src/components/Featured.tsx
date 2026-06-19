export default function Featured() {
  return (
    <div id="catalog" className="flex flex-col lg:flex-row lg:justify-between lg:items-center min-h-screen px-6 py-12 lg:py-0 bg-white">
      <div className="flex-1 h-[400px] lg:h-[800px] mb-8 lg:mb-0 lg:order-2">
        <img
          src="/images/exterior.png"
          alt="Современный дом для аренды"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 text-left lg:h-[800px] flex flex-col justify-center lg:mr-12 lg:order-1">
        <h3 className="uppercase mb-4 text-sm tracking-wide text-neutral-600">Дома, в которые хочется вернуться</h3>
        <p className="text-2xl lg:text-4xl mb-8 text-neutral-900 leading-tight">
          От уютных коттеджей у моря до панорамных вилл в горах. Каждый дом проверен,
          а бронирование занимает меньше минуты — без звонков и долгих переписок.
        </p>
        <button
          onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
          className="bg-black text-white border border-black px-4 py-2 text-sm transition-all duration-300 hover:bg-white hover:text-black cursor-pointer w-fit uppercase tracking-wide"
        >
          Смотреть дома
        </button>
      </div>
    </div>
  );
}