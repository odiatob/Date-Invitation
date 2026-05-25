import Image from "next/image";

export default function Home() {
  const nyotaIconPool = [
    "/background-icons/20241114_104303_399669____1_____1200x1200-removebg-preview.png",
    "/background-icons/71e0jHKq6AL._AC_UF350_350_QL80_-removebg-preview.png",
    "/background-icons/what-is-crybaby-crybunny-cryteddy-singapore-where-to-buy-removebg-preview.png",
  ];

  const nyota = Array.from({ length: 26 }, (_, index) => {
    const size = (26 + ((index * 9) % 30)) * 5;
    const top = (index * 29) % 100;
    const left = (index * 17 + 11) % 100;
    const delay = ((index % 6) * 0.35).toFixed(2);
    const duration = (5 + (index % 5) * 1.25).toFixed(2);
    const icon = nyotaIconPool[index % nyotaIconPool.length];

    return {
      id: index,
      icon,
      style: {
        "--figure-size": `${size}px`,
        "--figure-top": `${top}%`,
        "--figure-left": `${left}%`,
        "--figure-delay": `${delay}s`,
        "--figure-duration": `${duration}s`,
      } as React.CSSProperties,
    };
  });

  return (
    <div className="page-wrap">
      <div className="nyota-field" aria-hidden="true">
        {nyota.map((figure) => (
          <span key={figure.id} className="nyota-figure" style={figure.style}>
            <Image src={figure.icon} alt="" width={96} height={96} />
          </span>
        ))}
      </div>

      <main className="invite-card">
        <p className="eyebrow">Date Invitation</p>
        <h1 className="headline">Sunset with Nikki</h1>
        <p className="lead">
          A golden evening plan with warm lights, a sweet playlist, and quiet
          stargazing after dinner.
        </p>

        <section className="details-grid" aria-label="Invitation details">
          <div className="detail-block">
            <h2>When</h2>
            <p>Friday, May 29 · 6:30 PM</p>
          </div>
          <div className="detail-block">
            <h2>Where</h2>
            <p>Rooftop Garden, West View</p>
          </div>
          <div className="detail-block">
            <h2>Theme</h2>
            <p>Yellow tones, Baby Three + Cry Baby mood, cozy sparkle</p>
          </div>
          <div className="detail-block">
            <h2>Dress Code</h2>
            <p>Anything cozy with a hint of gold</p>
          </div>
        </section>

        <button type="button" className="rsvp-button">
          RSVP
        </button>
      </main>
    </div>
  );
}
