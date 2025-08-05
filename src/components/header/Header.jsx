export default function Header({ image, titulo }) {
  return (
    <div className="w-full overflow-hidden relative">
      <img
        src={image}
        alt="Header"
        className="w-full h-full block object-cover"
      />
      <div className="absolute inset-0 flex items-start justify-start pl-12 pt-10 h-full w-full">
        <h1 className="text-white text-6xl font-extrabold px-8 py-50 rounded-lg shadow-xl">
          {titulo}
        </h1>
      </div>
    </div>
  );
}