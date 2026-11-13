import { ArrowUp, External, Icon } from "@/components/glaze/icon";

/** Quiet close to the page: data provenance and a way back to the masthead. */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line-faint">
      <div className="mx-auto flex w-full max-w-(--page-width) flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
        <p className="type-caption text-text-2">
          FMData. Histórico pessoal de escuta, a partir de dados públicos do
          Last.fm.
        </p>
        <div className="flex items-center gap-5">
          <a
            href="https://www.last.fm"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 type-caption text-text-2 hover:text-text-1"
          >
            Last.fm
            <Icon icon={External} size={12} />
            <span className="sr-only">(abre num separador novo)</span>
          </a>
          <a
            href="#topo"
            className="inline-flex items-center gap-1 type-caption text-text-2 hover:text-text-1"
          >
            Voltar ao topo
            <Icon icon={ArrowUp} size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}
