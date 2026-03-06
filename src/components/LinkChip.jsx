const ICONS = {
  resume: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 1h7l3 3v11H3V1zm7 1.5V5h2.5L10 2.5zM5 8h6v1H5V8zm0 2h6v1H5v-1z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1.2a6.8 6.8 0 0 0-2.16 13.25c.34.07.46-.15.46-.33v-1.2c-1.88.4-2.28-.8-2.28-.8-.3-.78-.75-.98-.75-.98-.62-.42.05-.4.05-.4.69.05 1.05.7 1.05.7.6 1.03 1.58.73 1.97.56.06-.44.24-.73.44-.9-1.5-.17-3.08-.75-3.08-3.35 0-.74.26-1.34.7-1.82-.07-.17-.3-.86.07-1.78 0 0 .57-.18 1.87.7a6.44 6.44 0 0 1 3.4 0c1.3-.88 1.86-.7 1.86-.7.37.92.14 1.6.07 1.78.44.48.7 1.08.7 1.82 0 2.6-1.58 3.18-3.08 3.35.24.2.46.6.46 1.22v1.8c0 .18.12.4.47.33A6.8 6.8 0 0 0 8 1.2z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.4 5.8H5V14H2.4V5.8zM3.7 2A1.5 1.5 0 1 1 2.2 3.5 1.5 1.5 0 0 1 3.7 2zM6.4 5.8h2.5V7h.04c.35-.66 1.22-1.35 2.5-1.35 2.67 0 3.17 1.76 3.17 4.05V14H12V10.4c0-.86-.02-1.97-1.2-1.97-1.2 0-1.38.94-1.38 1.9V14H6.8V5.8z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M1.5 3h13A1.5 1.5 0 0 1 16 4.5v7A1.5 1.5 0 0 1 14.5 13h-13A1.5 1.5 0 0 1 0 11.5v-7A1.5 1.5 0 0 1 1.5 3zm0 1 6.5 4.2L14.5 4h-13zm13 8v-6l-6.23 4.03a.5.5 0 0 1-.54 0L1.5 6v6h13z" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.2 1.5h2c.38 0 .7.28.75.66l.28 2.1a.75.75 0 0 1-.43.76L4.7 5.6a11.2 11.2 0 0 0 5.7 5.7l.56-1.1a.75.75 0 0 1 .76-.43l2.1.28c.38.05.66.37.66.75v2a1 1 0 0 1-1.1 1A12.9 12.9 0 0 1 2.2 2.6a1 1 0 0 1 1-1.1z" />
    </svg>
  ),
  live: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm4.9 6h-2.2a10.7 10.7 0 0 0-.8-3 5.52 5.52 0 0 1 3 3zM8 2.8c.5.6 1.15 2.05 1.38 4.7H6.62C6.85 4.85 7.5 3.4 8 2.8zM4.1 4.5a10.7 10.7 0 0 0-.8 3H1.1a5.52 5.52 0 0 1 3-3zm-3 4h2.2c.12 1.1.4 2.15.8 3a5.52 5.52 0 0 1-3-3zm4.9 4.7c-.5-.6-1.15-2.05-1.38-4.7h2.76c-.23 2.65-.88 4.1-1.38 4.7zm1.12-4.7h2.76c-.23 2.65-.88 4.1-1.38 4.7-.5-.6-1.15-2.05-1.38-4.7zm2.78 3a10.7 10.7 0 0 0 .8-3h2.2a5.52 5.52 0 0 1-3 3z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5.2 4.2 1.4 8l3.8 3.8.8-.8L3.1 8l2.9-3-.8-.8zm5.6 0-.8.8 2.9 3-2.9 3 .8.8L14.6 8l-3.8-3.8zM8.9 2.4l-2 11.2 1 .2 2-11.2-1-.2z" />
    </svg>
  )
};

export default function LinkChip({ href, label, icon = "live", external = false, downloadName }) {
  const isDataUrl = typeof href === "string" && href.startsWith("data:");
  const props = external && !isDataUrl ? { target: "_blank", rel: "noreferrer" } : {};
  if (downloadName) {
    props.download = downloadName;
  }
  return (
    <a href={href} className="content-link" {...props}>
      <span className="content-link-icon">{ICONS[icon] || ICONS.live}</span>
      <span>{label}</span>
    </a>
  );
}
