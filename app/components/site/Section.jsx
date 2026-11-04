// Shared section shell: heading in the left column, content on the right.
export default function Section({ id, title, children, className = "" }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`border-t border-rule ${className}`}>
      <div className="mx-auto grid max-w-page grid-cols-1 gap-8 px-5 py-20 md:grid-cols-12 md:gap-8 md:px-8 md:py-28">
        <h2
          id={`${id}-title`}
          className="font-display text-4xl font-semibold leading-none tracking-[-0.03em] md:col-span-3 md:text-[2.75rem]"
          style={{ fontVariationSettings: "'wdth' 85, 'opsz' 48" }}
        >
          {title}
        </h2>
        <div className="md:col-span-9">{children}</div>
      </div>
    </section>
  );
}
