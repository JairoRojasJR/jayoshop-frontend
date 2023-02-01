export default function Ubication() {
  return (
    <>
      <section className="df aic fdc" style={{ margin: '1rem 0', gap: '1rem' }}>
        <h3 className="tac">Ubicación</h3>
        <p style={{ padding: '1rem' }}>
          Estamos ubicados al sur de Machala, barrio San Francisco. Referencia:
          desde la casa comunal de San Francisco 2 cuadras, casi en toda la
          esquina llegando a la camaronera. El nombre del local es (...)
        </p>
        <iframe
          width="90%"
          height="300px"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="/maps.html"
        ></iframe>
      </section>
    </>
  );
}
