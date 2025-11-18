export default function HeaderMobile({ image }) {
  return (
    <div className="w-full overflow-hidden relative" style={{ height: "90vh" }}>
      <img
        src={image}
        alt="Header"
        className="w-full h-full block object-cover"
        style={{ height: "100%" }}
      />
    </div>
  );
}
