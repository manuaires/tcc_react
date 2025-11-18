export default function Header({ image }) {
  return (
    <div className="w-full overflow-hidden relative">
      <img
        src={image}
        alt="Header"
        className="w-full h-full block object-cover"
      />
    </div>
  );
}
