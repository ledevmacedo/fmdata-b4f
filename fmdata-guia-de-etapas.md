# fmdata — Guia de resolução, passo a passo

Dashboard Last.fm — projeto final de frontend.
Arranque: **09/11 às 13:00** · Entrega: **17/11 às 09:00** (~8 dias).

Este guia não repete os slides: organiza o trabalho pela **ordem em que os problemas se resolvem**, de modo que cada etapa assenta no que a anterior já deixou pronto. Cada etapa diz **o que construir, porquê nesta posição, como decidir os detalhes e como saber que está certo**.

> Os nomes de funções, hooks e ficheiros são **sugestões de arquitetura**. Os contratos de dados (campos, endpoints, erros) vêm da API; confirma sempre os parâmetros exatos em `/docs`.

---

## Índice

0. [A lógica da ordem](#0-a-lógica-da-ordem)
1. [Preparação do projeto e das skills](#1-preparação-do-projeto-e-das-skills)
2. [Explorar a API antes de escrever código](#2-explorar-a-api-antes-de-escrever-código)
3. [Tipos](#3-tipos)
4. [Funções puras em `lib/`](#4-funções-puras-em-lib)
5. [Camada de pedidos e store Zustand](#5-camada-de-pedidos-e-store-zustand)
6. [Hooks](#6-hooks)
7. [Dashboard](#7-dashboard)
8. [Página do artista](#8-página-do-artista)
9. [Análise única](#9-análise-única)
10. [Acabamento](#10-acabamento)
11. [Revisão final com skills](#11-revisão-final-com-skills)
12. [Slide e demonstração](#12-slide-e-demonstração)
13. [Cronograma sugerido](#13-cronograma-sugerido)
14. [Quando algo corre mal: ordem de diagnóstico](#14-quando-algo-corre-mal-ordem-de-diagnóstico)
15. [Armadilhas e soluções](#15-armadilhas-e-soluções)
16. [Checklist e avaliação](#16-checklist-e-avaliação)

---

## 0. A lógica da ordem

```txt
dados da API
  -> tipos (como são os dados)
  -> funções puras em lib/ (o que se calcula)
  -> store Zustand (onde ficam, cache, persistência)
  -> hooks (como os componentes os pedem)
  -> componentes (como se mostram)
```

A ordem de construção segue esta cadeia **da esquerda para a direita**, por três razões:

1. **Funções puras são as mais baratas de testar.** Recebem um array e devolvem um resultado; não precisam de rede, store nem React. Erros aqui apanham-se em segundos.
2. **Cada camada só depende da anterior.** Se começares pelos componentes, vais inventar dados falsos e refazer tudo quando a API mostrar a realidade.
3. **Os dois ecrãs partilham a base.** Dashboard e página do artista usam as mesmas funções (`scrobblesPorHora`, `topMusicas`…); resolve-as uma vez.

**Regra de ouro:** não passes à etapa seguinte sem cumprir o "como saber que está pronto" da atual.

---

## 1. Preparação do projeto e das skills

### 1.1 Criar o projeto

Cria uma app Next.js com **App Router** e TypeScript. Confirma que `npm run dev` abre a página inicial antes de instalares mais nada.

### 1.2 Instalar as dependências

```bash
npm install zustand
npm install recharts
npm install solar-icons
```

| Biblioteca | Para quê |
|---|---|
| Zustand | estado global (`periodo`), cache `Entry<T>`, persistência em `localStorage`, deduplicação |
| Recharts | gráfico 24h, relógio 24h do artista, scrobbles por mês |
| Solar Icons | navegação, favoritos, links externos, estados vazios |

### 1.3 Instalar as skills obrigatórias

```bash
npx skills add https://github.com/andy-spike/skills --skill recharts
npx skills add https://github.com/fusengine/claude-plugins --skill nextjs-zustand
npx skills add saoudi-h/solar-icons --skill solar-icons
npx skills add https://github.com/wshobson/agents --skill nextjs-app-router-patterns
npx skills add https://github.com/pbakaus/impeccable --skill impeccable
npx skills add https://github.com/dietrichgebert/ponytail --skill ponytail
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill design-system
```

### 1.4 Em que fase usar cada skill

| Skill | Fase | Para quê, concretamente |
|---|---|---|
| `nextjs-app-router-patterns` | 7, 8 | estrutura de rotas, `layout.tsx`, páginas dinâmicas `[nome]`, client vs server components |
| `nextjs-zustand` | 5, 6 | forma da store, `persist`, `skipHydration`, hidratação segura no Next |
| `recharts` | 7, 8, 9 | gráficos de barras/linhas, `ResponsiveContainer`, tooltips |
| `solar-icons` | 7, 8, 10 | ícones de navegação, favoritos, links externos, estados vazios |
| `design-system` e `impeccable` | 7, 8, 10 | hierarquia visual, contraste, espaçamento, responsividade |
| `ponytail` | 4, 11 | revisão e refactor: funções demasiado grandes, duplicação, nomes |

> Usa a skill **antes** de escrever a parte a que se aplica, não só no fim. Uma skill de Zustand lida depois de a store estar feita já só serve para refazer.

### 1.5 Estrutura de pastas sugerida

```txt
app/
  layout.tsx
  page.tsx                      # dashboard (/)
  artistas/[nome]/page.tsx      # página do artista
components/
  dashboard/                    # blocos do dashboard
  artista/                      # blocos da página do artista
  ui/                           # loading, erro, vazio, cartão
lib/                            # só funções puras
  dates.ts
  filters.ts
  stats.ts
  artist.ts
  analise.ts                    # a tua análise única (etapa 9)
services/
  api.ts                        # os fetch (fora de lib/)
store/
  useStore.ts
hooks/
types/
  index.ts
```

**Porque `services/` separado de `lib/`:** `lib/` não pode ter `fetch`. Os pedidos precisam de um lugar próprio.

**Pronto quando:** o projeto corre, as dependências estão instaladas, as skills estão disponíveis e as pastas existem.

---

## 2. Explorar a API antes de escrever código

**Porquê agora:** todos os tipos e funções dependem do formato real dos dados. Descobri-lo depois obriga a refazer.

### 2.1 Factos da API

- **Base:** `https://fmdata-api.onrender.com`
- **Docs:** `/docs` · **OpenAPI:** `/openapi.json`
- Sem autenticação e sem rate limiting.
- Erros: `400` parâmetro em falta · `404` não encontrado.

| Grupo | Endpoints |
|---|---|
| Scrobbles | `/scrobbles`, `/scrobbles/amostra` |
| Perfis | `/artist-info`, `/album-info` |
| Imagens | `/artist-image`, `/album-image`, `/track-image` |
| Estatísticas | `/stats/listening-clock` |
| Sistema | `/health` |

### 2.2 O que fazer (por esta ordem)

1. **Abre `/docs`** e lê cada endpoint: parâmetros obrigatórios, parâmetros opcionais, formato da resposta.
2. **Chama `/health`** para saberes se a API está acordada (serviços em hospedagem gratuita podem demorar ao primeiro pedido, por isso o teu estado de loading tem de aguentar isto).
3. **Chama `/scrobbles/amostra`** e guarda a resposta num ficheiro de exemplo. É o que vais usar para testar as funções puras.
4. **Chama `/scrobbles`** e vê quantos registos devolve e quanto demora. Isto decide se a cache em `localStorage` é urgente.
5. **Chama `/artist-info`** com um artista que existe e com um que não existe: vê o `404`. Chama sem parâmetro: vê o `400`.
6. **Chama `/album-info`** e confirma o formato de `tracklist_names`.
7. **Percorre os dados à procura de casos estranhos:** `date_iso` a `null`, a `"nowplaying"`, artistas com acentos, espaços ou `/` no nome, `tags` vazias.

### 2.3 Perguntas que tens de ter respondido no fim

- Que parâmetros aceita `/scrobbles` (utilizador, limites, paginação)?
- Quantos registos vem na resposta completa?
- O `date_uts` está em segundos ou milissegundos?
- Como é a resposta de erro (corpo, não só código)?
- Que nomes de artista têm caracteres especiais?

**Pronto quando:** tens um ficheiro de exemplo real com dezenas de scrobbles e as respostas às perguntas acima anotadas.

---

## 3. Tipos

**Porquê agora:** todas as funções seguintes recebem e devolvem estes tipos. Se mudarem a meio, mudas tudo.

Usa `interface` para formas de objeto e `type` apenas para uniões de uma linha.

### 3.1 Tipos da API

```ts
interface Scrobble {
  track_name: string;
  artist_name: string;
  album_name: string;
  date_iso: string | null;
  date_uts: number | null;
  tags: string;
  loved: number;
  image_url: string | null;
  nowplaying: boolean;
}

interface ArtistInfo {
  name: string;
  image_url: string;
  tags: string;
  listeners_global: number;
  bio_summary: string;
  bio_content: string;
  similar_artists: string;
  url_lastfm: string;
  url_wikipedia: string | null;
  url_musicbrainz: string | null;
}

interface AlbumInfo {
  album_name: string;
  artist_name: string;
  image_url: string;
  track_count: number;
  tracklist_names: string;
  tags: string;
  release_date: string;
}
```

Pontos a ter sempre presentes: a data pode faltar; `tags` e `similar_artists` são texto com vírgulas; `tracklist_names` separa faixas por `;`; `loved` é `0` ou `1`.

### 3.2 Tipos do teu domínio

```ts
type Periodo = "tudo" | "30d" | "14d" | "7d" | "24h";
type Status = "idle" | "loading" | "success" | "error" | "not-found";

interface Entry<T> {
  data: T | null;
  status: Status;
  error: string | null;
  updatedAt: number | null;
}

interface ItemRanking {
  chave: string;       // identificador único (ex.: "artista::faixa")
  nome: string;        // o que se mostra
  subtitulo?: string;  // ex.: artista de uma faixa
  contagem: number;
  imagem?: string | null;
}

interface PontoMensal {
  mes: string;         // "2024-03"
  contagem: number;
}

interface ArtistaSemelhante {
  nome: string;
  ouvido: boolean;     // existe nos teus scrobbles?
}
```

**Decisão importante:** o `Entry<T>` é o "envelope" de qualquer dado que vem da rede. Em vez de teres `loading`, `error` e `data` espalhados, tens sempre a mesma forma, e todos os hooks e componentes lidam com ela da mesma maneira.

**Pronto quando:** o TypeScript compila e o ficheiro de exemplo da etapa 2 passa por `Scrobble[]` sem erros.

---

## 4. Funções puras em `lib/`

**Regra:** sem `fetch`, sem acesso ao store, sem `Date.now()` escondido. Entram dados, sai resultado. Isto torna-as previsíveis e testáveis com o ficheiro de exemplo.

**Ordem de construção** (cada ficheiro usa o anterior): `dates.ts` → `filters.ts` → `stats.ts` → `artist.ts`.

**Como testar cada uma:** cria um array pequeno à mão (3 a 6 scrobbles) com os casos limite e confirma o resultado de cabeça antes de ligar ao ficheiro real. Se tiveres tempo, escreve testes simples (ex.: Vitest); se não, um script com `console.log` serve.

### 4.1 `dates.ts` — datas, horas e períodos

Resolve o problema mais traiçoeiro do projeto: **datas inconsistentes**. Faz-se primeiro porque tudo o resto depende dele.

#### `parseDataScrobble(s: Scrobble): Date | null`
**O que faz:** devolve a data de uma reprodução, ou `null` se não a tiver.
**Como decidir:** prefere `date_uts` (número, sem ambiguidade de formato); usa `date_iso` como alternativa; se `date_iso` for `null` ou `"nowplaying"`, devolve `null`.
**Casos limite:** confirma na etapa 2 se `date_uts` está em segundos (multiplica por 1000) ou em milissegundos.

#### `temDataValida(s: Scrobble): boolean`
**O que faz:** diz se uma reprodução pode entrar em cálculos temporais.
**Para quê:** é o filtro de limpeza que usas antes de qualquer análise por hora, mês ou período.

#### `dataDeReferencia(scrobbles: Scrobble[]): Date | null`
**O que faz:** devolve a data da reprodução **mais recente**.
**Porquê existe:** "últimas 24 horas" não conta a partir de agora, conta a partir da reprodução mais recente. Esta função é a âncora de todos os períodos.
**Caso limite:** array vazio devolve `null`.

#### `duracaoDoPeriodoMs(periodo: Periodo): number | null`
**O que faz:** converte `"7d"` em milissegundos (`7 * 24 * 3600 * 1000`). Devolve `null` para `"tudo"`.
**Porquê separada:** mantém uma tabela única de períodos; se acrescentares "90d", só mexes aqui.

#### `inicioDoPeriodo(periodo: Periodo, referencia: Date): Date | null`
**O que faz:** `referencia - duração`. Devolve `null` para `"tudo"`.

#### `horaUTC(data: Date): number`
**O que faz:** devolve a hora (0–23) em **UTC**, com `getUTCHours()`.
**Porquê UTC:** o enunciado do gráfico 24h é em UTC; usar a hora local desalinha com a API e com o endpoint `/stats/listening-clock`.

#### `chaveDoMes(data: Date): string`
**O que faz:** devolve `"2024-03"` (ano-mês em UTC).
**Para quê:** agrupar por mês e ordenar cronologicamente por simples ordem alfabética.

#### `formatarData(data: Date): string` e `formatarMes(chave: string): string`
**O que fazem:** apresentação para o utilizador (`"12 mar 2024"`, `"mar 2024"`).
**Porquê separadas:** formatar é apresentação; mantém-na fora das funções de cálculo.

**Pronto quando:** todas as funções passam nos casos: data `null`, `"nowplaying"`, array vazio, `"tudo"`.

### 4.2 `filters.ts` — filtrar scrobbles

#### `normalizarNome(texto: string): string`
**O que faz:** `trim` + minúsculas (e, se necessário, remove acentos).
**Porquê:** comparar artistas por texto cru falha com maiúsculas ou espaços; é a base de todas as comparações por nome.

#### `separarLista(texto: string, separador = ","): string[]`
**O que faz:** transforma `"rock, indie ,pop"` em `["rock","indie","pop"]`: divide, `trim`, remove vazios.
**Onde se usa:** `tags`, `similar_artists` (vírgula) e `tracklist_names` (`;`). É a função mais reutilizada do projeto: faz-a bem uma vez.

#### `removerSemData(scrobbles: Scrobble[]): Scrobble[]`
**O que faz:** descarta `nowplaying` e audições sem data válida.
**Quando:** antes de qualquer cálculo temporal. Para totais simples, decide conscientemente se contas ou não a "a tocar agora".

#### `filtrarPorPeriodo(scrobbles: Scrobble[], periodo: Periodo): Scrobble[]`
**O que faz:** devolve só as audições dentro do período.
**Como:** `dataDeReferencia` → `inicioDoPeriodo` → `filter`. Para `"tudo"` devolve tudo sem calcular.
**Caso limite:** a referência é calculada a partir do **array completo**, não do já filtrado.

#### `filtrarPorArtista(scrobbles: Scrobble[], nome: string): Scrobble[]`
**O que faz:** devolve só as audições do artista, comparando com `normalizarNome`.

**Pronto quando:** `filtrarPorPeriodo(amostra, "24h")` devolve só audições dentro de 24 h da mais recente.

### 4.3 `stats.ts` — rankings e contagens

#### `contarPor<T>(itens: T[], chave: (item: T) => string): Map<string, number>`
**O que faz:** contagem genérica. É o motor de todos os rankings.

#### `paraRanking(contagens: Map<string, number>, limite: number): ItemRanking[]`
**O que faz:** ordena do maior para o menor e corta no `limite`.
**Decisão:** define um critério de **desempate** (ex.: ordem alfabética) para o ranking não mudar de ordem a cada render.

#### `totalScrobbles(scrobbles: Scrobble[]): number` e `totalArtistasDistintos(scrobbles: Scrobble[]): number`
**O que fazem:** os dois números do bloco "Totais". Artistas distintos usa `Set` com `normalizarNome`.

#### `topArtistas(scrobbles: Scrobble[], n = 20): ItemRanking[]`
**Chave:** nome de artista normalizado.

#### `topMusicas(scrobbles: Scrobble[], n = 10): ItemRanking[]`
**Chave:** `artista + faixa`, nunca só a faixa. Duas músicas com o mesmo título de artistas diferentes não são a mesma.
**Extras a guardar:** artista (subtítulo), álbum e imagem.

#### `topAlbuns(scrobbles: Scrobble[], n = 8): ItemRanking[]`
**Chave:** `artista + álbum`. Ignora audições sem álbum (ou agrupa-as de forma explícita).

#### `scrobblesPorHora(scrobbles: Scrobble[]): number[]`
**O que faz:** devolve **sempre** um array de 24 posições (0–23), com 0 nas horas sem audições.
**Porquê:** o gráfico precisa das 24 barras mesmo quando há buracos.

#### `horaDePico(porHora: number[]): number | null`
**O que faz:** índice com o valor mais alto, para o destaque no gráfico. `null` se tudo for zero.

#### `generoMaisOuvido(scrobbles: Scrobble[]): { genero: string; contagem: number } | null`
**O que faz:** para cada reprodução, `separarLista(tags)`, conta cada etiqueta e devolve a maior.
**Caso limite:** `tags` vazias; normaliza maiúsculas/minúsculas para `"Rock"` e `"rock"` contarem juntas.

**Pronto quando:** com a amostra, os totais e os tops batem com o que verificas à mão numa contagem pequena.

### 4.4 `artist.ts` — análise por artista

Todas recebem os scrobbles **já filtrados por artista** (`filtrarPorArtista`), exceto onde indicado.

#### `artistaExiste(scrobbles: Scrobble[], nome: string): boolean`
**O que faz:** diz se o artista aparece nos dados. Decide a página "não encontrado".

#### `resumoDoArtista(doArtista: Scrobble[], todos: Scrobble[])`
**O que devolve:** total de audições, percentagem do teu total (`doArtista.length / todos.length`), número de faixas favoritas (`loved === 1`, **faixas distintas**, não audições), primeira e última reprodução.
**Caso limite:** `todos` vazio (evita divisão por zero); audições sem data na primeira/última.

#### `topMusicasDoArtista(doArtista: Scrobble[], n = 10): ItemRanking[]`
**O que faz:** agrupa por faixa e conta. Pode reutilizar `contarPor` + `paraRanking`.

#### `albunsDoArtista(doArtista: Scrobble[])`
**O que faz:** agrupa por álbum e devolve, para cada um, as **faixas distintas ouvidas** (o "X" de "Ouviste X de Y faixas") e o total de audições.
**Nota:** o "Y" vem de `AlbumInfo.track_count`; a função não o calcula, o componente combina os dois.

#### `scrobblesPorMes(doArtista: Scrobble[]): PontoMensal[]`
**O que faz:** agrupa por `chaveDoMes`, ordena cronologicamente e **preenche os meses vazios com 0** entre o primeiro e o último mês.
**Porquê preencher:** sem isso o gráfico "salta" meses e engana a leitura da evolução.

#### `ultimasAudicoes(doArtista: Scrobble[], n = 10): Scrobble[]`
**O que faz:** ordena da mais recente para a mais antiga (ignorando as sem data) e corta.

#### `artistasSemelhantes(info: ArtistInfo, todos: Scrobble[]): ArtistaSemelhante[]`
**O que faz:** `separarLista(info.similar_artists)` e marca `ouvido: true` se o nome existe nos teus scrobbles.
**Para quê:** só os ouvidos são clicáveis na interface.

> `relogio24h` do artista é a mesma `scrobblesPorHora` aplicada aos scrobbles do artista: não escrevas uma segunda função.

**Pronto quando:** com um artista conhecido da amostra, todos os números do cartão de estatísticas conferem à mão.

---

## 5. Camada de pedidos e store Zustand

**Porquê agora:** as funções puras já funcionam com o ficheiro de exemplo; falta ligá-las a dados reais, guardá-los e evitar pedir duas vezes o mesmo.

Antes de começar, consulta a skill `nextjs-zustand`.

### 5.1 `services/api.ts` — os pedidos

Funções que só fazem `fetch` e devolvem dados tipados:

- `obterScrobbles(): Promise<Scrobble[]>`
- `obterArtistInfo(nome: string): Promise<ArtistInfo>` (usa `encodeURIComponent` no parâmetro)
- `obterAlbumInfo(artista: string, album: string): Promise<AlbumInfo>`

**Tratamento de erros (decide aqui, uma vez):**

| Resposta | O que a função faz |
|---|---|
| `404` | lança um erro identificável como "não encontrado" |
| `400` | lança erro de programação (parâmetro em falta; é bug teu) |
| rede / outro | lança erro genérico com mensagem para o utilizador |

### 5.2 A forma da store

```ts
interface StoreState {
  periodo: Periodo;
  scrobbles: Entry<Scrobble[]>;
  artistas: Record<string, Entry<ArtistInfo>>;   // chave: nome normalizado
  albuns: Record<string, Entry<AlbumInfo>>;      // chave: artista + álbum normalizados

  setPeriodo: (p: Periodo) => void;
  carregarScrobbles: () => Promise<void>;
  carregarArtista: (nome: string) => Promise<void>;
  carregarAlbum: (artista: string, album: string) => Promise<void>;
}
```

### 5.3 Os quatro problemas que a store resolve

**1. Estado global.** O `periodo` vive aqui para que todo o dashboard reaja à mesma escolha.

**2. Cache.** Cada pedido guarda um `Entry<T>`. Se `status === "success"` e há dados, não voltas a pedir.

**3. Persistência.** Com o middleware `persist`, a cache sobrevive ao refresh.
- Usa `partialize` para guardar só o que interessa (`periodo` e os dados), **não** o `status`.
- Se um `status: "loading"` for persistido e a página fechar a meio, ao regressar ficaria **preso em loading para sempre**. Ao rehidratar, repõe qualquer `"loading"` para `"idle"`.

**4. Deduplicação.** Dois componentes a pedir o mesmo artista em simultâneo não podem gerar dois `fetch`.
- Mantém um registo **fora da store** (um `Map<string, Promise<void>>` ao nível do módulo) com os pedidos em curso.
- Antes de pedir, verifica se já existe uma promessa para essa chave; se existe, devolve-a em vez de criar outra; quando termina, remove-a.

### 5.4 O `skipHydration` (a armadilha do Next.js)

No Next, o servidor renderiza sem `localStorage`; se o cliente hidratar a store logo no primeiro render, o HTML do servidor e o do cliente diferem (erro de hidratação).

**Solução:** `persist` com `skipHydration: true` e reidratação manual no cliente, depois de montar. É isso que o hook `useHydrated` (etapa 6) faz.

**Pronto quando:**
- carregas a página, vês os dados, fazes refresh e **não há segundo pedido de rede** (separador Network);
- abres duas vezes a mesma página do artista rapidamente e só há **um** pedido;
- não aparece nenhum aviso de hidratação na consola.

---

## 6. Hooks

**Porquê agora:** os componentes não devem conhecer a store nem a rede. Falam só com hooks, que escondem hidratação, cache, filtro e pedidos.

**Princípio:** cada hook tem **uma** responsabilidade e devolve uma forma previsível. Os hooks compõem-se uns aos outros.

**Ordem de construção** (do mais simples ao mais dependente): `useHydrated` → `usePeriodo` → `useScrobbles` → `useFiltrados` → `useArtistInfo` → `useAlbumInfo`. Opcionalmente, `useScrobblesDoArtista`.

### `useHydrated()` — hidratação do store
**Descrição:** devolve `true` quando a store persistida já foi lida do `localStorage` no cliente. Antes disso devolve `false`.
**Como funciona:** num `useEffect`, chama a reidratação manual da store (`persist.rehydrate()`) e, quando termina, passa o estado para `true`.
**Para quê:** impede que um componente decida "não tenho dados, vou pedir" antes de a cache ter sido lida, o que causaria pedidos desnecessários e erros de hidratação.
**Retorno:** `boolean`.
**Cuidado:** garante que a reidratação corre **uma vez**, mesmo que o hook seja usado em vários componentes.

### `usePeriodo()` — filtro global
**Descrição:** lê e altera o período escolhido, partilhado por todo o dashboard.
**Retorno:** `{ periodo: Periodo; setPeriodo: (p: Periodo) => void }`.
**Como funciona:** seleciona só `periodo` e `setPeriodo` da store (seletores específicos, para o componente não re-renderizar com mudanças alheias).
**Cuidado:** a página do artista **não** deve ser afetada por este valor.

### `useScrobbles()` — dados, status e erro
**Descrição:** devolve o histórico completo de audições e dispara o carregamento quando é preciso.
**Retorno:** `{ data: Scrobble[]; status: Status; error: string | null; recarregar: () => void }`.
**Como funciona:**
1. espera por `useHydrated()`;
2. se o `status` é `"idle"` (sem dados em cache), chama `carregarScrobbles()` num `useEffect`;
3. se já há `success`, não faz nada.

**Cuidado:** `data` deve ser um array vazio estável (não um novo `[]` a cada render) quando ainda não há dados, para não invalidar `useMemo` a jusante.

### `useFiltrados()` — scrobbles filtrados pelo período
**Descrição:** o hook que o dashboard inteiro consome: dados limpos e já filtrados pelo período escolhido.
**Retorno:** `{ scrobbles: Scrobble[]; todos: Scrobble[]; referencia: Date | null; status: Status; error: string | null }`.
**Como funciona:** junta `useScrobbles()` e `usePeriodo()` e aplica `removerSemData` + `filtrarPorPeriodo` dentro de um `useMemo` com dependências `[todos, periodo]`.
**Cuidado:** o `useMemo` é essencial; sem ele refaz-se o filtro (sobre milhares de registos) em cada render.

### `useArtistInfo(nome)` — perfil do artista
**Descrição:** devolve o perfil de um artista (foto, tags, biografia, semelhantes) a partir da API, com cache por nome.
**Retorno:** `Entry<ArtistInfo>` (`data`, `status`, `error`).
**Como funciona:**
1. normaliza o nome para a chave da cache;
2. espera pela hidratação;
3. se a chave não existe ou está `"idle"`, chama `carregarArtista(nome)`;
4. um `404` resulta em `status: "not-found"` (não em `"error"`).

**Cuidado:** distingue "não existe" de "falhou". O primeiro mostra uma página própria; o segundo oferece "tentar de novo".

### `useAlbumInfo(artista, album)` — informação do álbum (opcional)
**Descrição:** devolve o perfil de um álbum, sobretudo `track_count`, para mostrar "Ouviste X de Y faixas".
**Retorno:** `Entry<AlbumInfo>`.
**Cuidado:** é opcional; se a API falhar para um álbum, a interface deve **degradar com elegância** (mostra só "X faixas ouvidas") em vez de partir.

### `useScrobblesDoArtista(nome)` — extra sugerido
**Descrição:** devolve os scrobbles de um artista, a partir do histórico **completo** (sem filtro de período).
**Retorno:** `{ doArtista: Scrobble[]; todos: Scrobble[]; status: Status }`.
**Para quê:** a página do artista é all-time; este hook evita repetir `filtrarPorArtista` em cada bloco.

**Pronto quando:** consegues escrever uma página mínima que imprime `useFiltrados().scrobbles.length` e o valor muda ao mudar o período.

---

## 7. Dashboard

**Rota:** `/` · **Skills:** `nextjs-app-router-patterns`, `recharts`, `solar-icons`, `design-system`, `impeccable`.

### 7.1 Ordem de construção

Constrói **um bloco de cada vez**, do mais simples ao mais complexo, validando cada um antes do seguinte.

| # | Bloco | Funções usadas | Dificuldade |
|---|---|---|---|
| 1 | Layout + seletor de período | `usePeriodo` | baixa |
| 2 | Totais | `totalScrobbles`, `totalArtistasDistintos` | baixa |
| 3 | Top 20 artistas | `topArtistas` | média |
| 4 | Top 10 músicas | `topMusicas` | média |
| 5 | Top 8 álbuns | `topAlbuns` | média |
| 6 | Gráfico 24h | `scrobblesPorHora`, `horaDePico` | alta |
| 7 | Género mais ouvido | `generoMaisOuvido` | média |
| 8 | A tua análise única | `lib/analise.ts` (etapa 9) | à tua escolha |

### 7.2 Padrão de cada bloco

Aplica sempre a mesma receita:

1. `useFiltrados()` dá os scrobbles.
2. Uma função pura calcula o resultado dentro de `useMemo`.
3. O componente mostra **quatro estados**: loading, erro, vazio (período sem audições) e sucesso.

### 7.3 Detalhe de cada bloco

**Seletor de período.** Cinco opções: Tudo, 30 dias, 14 dias, 7 dias, 24 horas. Mostra claramente a opção ativa. Está no topo e afeta **todos** os blocos.

**Totais.** Dois números: audições e artistas distintos, para o período escolhido.

**Top 20 artistas.** Posição, foto, nome e contagem. O nome é um link para `/artistas/[nome]` com `encodeURIComponent`. A foto pode vir do `image_url` dos scrobbles ou do endpoint `/artist-image`; decide e mantém um fallback para quando falta.

**Top 10 músicas.** Posição, capa, faixa, artista/álbum e contagem. Fallback de imagem para quando `image_url` é `null`.

**Top 8 álbuns.** Grelha visual com a capa como fundo, título, artista e plays. O texto tem de ser legível sobre qualquer capa (garante contraste com uma sobreposição escura).

**Gráfico 24h.** Barras (Recharts) com as 24 horas (0–23 UTC) e a hora de maior escuta destacada com cor diferente. Usa `ResponsiveContainer`. Indica no eixo ou na legenda que é UTC.

**Género mais ouvido.** Mostra o género e, se quiseres, a contagem. Trata o caso de não haver tags.

**Pronto quando:** mudar o período atualiza **todos** os blocos em simultâneo e nenhum rebenta com período vazio.

---

## 8. Página do artista

**Rota:** `/artistas/[nome]` · **Sempre all-time** (ignora o filtro).

### 8.1 Primeiro problema: o nome

`useParams` devolve o nome **codificado**. Antes de qualquer outra coisa: `decodeURIComponent(nome)`. E todos os links que apontam para esta página usam `encodeURIComponent`. Testa com um artista com espaços e outro com caracteres especiais.

### 8.2 Segundo problema: o artista não existe

Resolve este caso **antes** dos blocos bons, para nunca rebentar a página:

| Situação | O que mostrar |
|---|---|
| a carregar | estado de loading |
| `not-found` (não existe nos dados ou a API devolveu `404`) | mensagem clara e link de volta ao dashboard |
| `error` | mensagem e botão "tentar de novo" |
| `success` | a página completa |

### 8.3 Ordem de construção

| # | Bloco | Funções/hooks | Notas |
|---|---|---|---|
| 1 | Cabeçalho | `useArtistInfo` | foto, nome, tags (`separarLista`), links (Last.fm, Wikipedia, MusicBrainz, os dois últimos podem ser `null`), biografia |
| 2 | Cards de estatísticas | `resumoDoArtista` | total, percentagem, favoritas, primeira e última reprodução |
| 3 | Top 10 músicas | `topMusicasDoArtista` | agrupadas por faixa, capa e contagem |
| 4 | Álbuns | `albunsDoArtista` + `useAlbumInfo` | "Ouviste X de Y faixas"; degrada se `AlbumInfo` falhar |
| 5 | Scrobbles por mês | `scrobblesPorMes` | gráfico de evolução (linha ou barras) |
| 6 | Relógio 24h | `scrobblesPorHora` | 24 buckets UTC, Recharts |
| 7 | Últimas 10 audições | `ultimasAudicoes` | da mais recente, com faixa e data |
| 8 | Artistas semelhantes | `artistasSemelhantes` | só os ouvidos são clicáveis |

### 8.4 Pormenores que se esquecem

- A biografia pode ter HTML ou links; decide se mostras `bio_summary` (curto) e/ou `bio_content` (longo, atrás de "ler mais") e como lidas com o conteúdo.
- Datas ausentes na primeira/última reprodução não podem aparecer como "Invalid Date".
- Artistas semelhantes não ouvidos aparecem, mas **sem link**, e com aspeto distinto.

**Pronto quando:** abres um artista que existe, um que não existe (digitando o URL à mão) e um com caracteres especiais, e as três situações se comportam bem.

---

## 9. Análise única

**Requisito extra:** além do dashboard e da página do artista, propõe **uma análise tua**.

> **Com esses dados, que informação consigo obter?**

### 9.1 Como escolher a pergunta (método)

1. **Escreve a pergunta numa frase**, em linguagem de utilizador, não de código.
2. **Teste do filtro:** a resposta já se obtém mudando o período? Se sim, descarta.
3. **Teste do top:** a resposta é um "mais ouvido de sempre" (artista, música, álbum, género, hora de pico)? Se sim, descarta.
4. **Teste dos dados:** consegues responder só com os campos que a API já dá (artista, faixa, álbum, data, tags, `loved`)? Se precisas de dados que não existem, descarta.
5. **Teste da graça:** a resposta diz algo que o utilizador não sabia sobre si?

### 9.2 Ideias com o caminho de cálculo

| Pergunta | Como calcular |
|---|---|
| Que artistas ouves só a certas horas? | agrupar por artista; para cada um, a distribuição por hora; destacar os que concentram a maior parte numa faixa horária |
| A tua diversidade de artistas muda ao longo do tempo? | por mês (`chaveDoMes`), contar artistas distintos |
| Ouves álbuns completos ou faixas soltas? | por álbum, comparar faixas distintas ouvidas com o `track_count` (`useAlbumInfo`) |
| Que artistas abandonaste? | artistas com muitas audições no passado e nenhuma recente |
| Quais as tuas músicas "de uma noite"? | faixas com muitas audições concentradas num único dia |

### 9.3 Como implementar

1. Escreve a função pura em `lib/analise.ts`, testa-a com a amostra.
2. Cria um bloco no dashboard com **a pergunta como título** e a resposta em baixo (número, lista ou gráfico).
3. Trata loading, erro e vazio como nos outros blocos.
4. Prepara **uma frase** para a apresentação: porque escolheste esta pergunta.

**Pronto quando:** o bloco mostra a pergunta e a resposta, e consegues justificar que não é replicável só com o filtro.

---

## 10. Acabamento

**Skills:** `nextjs-zustand`, `design-system`, `impeccable`, `solar-icons`.

### 10.1 Estados em toda a aplicação

Percorre cada bloco e cada página e provoca à força:

| Estado | Como o provocar |
|---|---|
| loading | limita a rede nas ferramentas do browser; limpa o `localStorage` |
| erro | desliga a rede; troca a base do URL por um inválido |
| vazio | escolhe o período "24 horas" com dados antigos |
| não encontrado | abre `/artistas/artista-que-nao-existe` |

Cria componentes reutilizáveis para loading, erro e vazio (em `components/ui/`) em vez de repetir markup.

### 10.2 Cache e deduplicação

- Refresh não gera pedidos novos quando há cache.
- Navegar dashboard → artista → dashboard não repete `/scrobbles`.
- Sem `status: "loading"` preso após fechar a página a meio.

### 10.3 Design e responsividade (skills `design-system` + `impeccable`)

- Hierarquia: o que o utilizador deve ver primeiro?
- Contraste do texto sobre capas e fundos.
- Espaçamento consistente; um só sistema de cores e tamanhos.
- Teste em largura de telemóvel (~375 px), tablet e desktop; os gráficos têm de encolher.
- Ícones coerentes (`solar-icons`) nos estados vazios, links externos e favoritos.

### 10.4 Pormenores de qualidade

- Imagens com `alt` e fallback.
- Elementos clicáveis com foco visível e navegáveis por teclado.
- Sem avisos na consola (hidratação, chaves em listas, etc.).

**Pronto quando:** consegues provocar cada estado e a aplicação responde com graça.

---

## 11. Revisão final com skills

**Skill principal:** `ponytail` (revisão e refactor).

Percorre por esta ordem:

1. **`lib/`**: nenhuma função mistura cálculo com `fetch` ou store? Há funções demasiado longas que se partem? Nomes claros?
2. **Duplicação**: a lógica das 24 horas existe uma só vez? A separação de listas também?
3. **Tipos**: sem `any`; `interface` para objetos; `type` só para uniões de uma linha.
4. **Hooks**: cada um com uma só responsabilidade; `useMemo` onde há cálculos pesados.
5. **Erros**: todos os pedidos têm tratamento; nenhuma exceção fica por apanhar.
6. **Armadilhas** (secção 15): confirma uma a uma.

---

## 12. Slide e demonstração

**A entrega vale 3 componentes:** projeto (checklist), slide, apresentação. Não deixes os dois últimos para a última hora.

### 12.1 Slide: o que tem de explicar

- **Problema:** o que o utilizador ganha em ver o seu histórico analisado.
- **Solução:** dois ecrãs (dashboard e artista) sobre a mesma base de dados.
- **Decisões:** pelo menos três escolhas tuas e o porquê (ex.: funções puras separadas, cache com deduplicação, a tua análise única).

### 12.2 Demonstração

Ensaia um percurso fixo de 3–5 minutos:

1. abrir o dashboard e mudar o período;
2. clicar num artista e percorrer a página;
3. mostrar a análise única e a pergunta por trás dela;
4. mostrar um estado de erro ou "não encontrado" tratado com graça.

Prepara respostas a: "porque separaste `lib/`?", "como evitas pedidos repetidos?", "o que acontece se a API falhar?".

---

## 13. Cronograma sugerido

Referência flexível; ajusta ao teu ritmo. **Reserva o último dia para slide e ensaio.**

| Dia | Foco | Etapas |
|---|---|---|
| Seg 09/11 (tarde) | Projeto, skills, explorar API | 1, 2 |
| Ter 10/11 | Tipos e funções puras | 3, 4 |
| Qua 11/11 | Store, pedidos e hooks | 5, 6 |
| Qui 12/11 | Dashboard completo | 7 |
| Sex 13/11 | Página do artista | 8 |
| Sáb 14/11 | Análise única | 9 |
| Dom 15/11 | Acabamento | 10 |
| Seg 16/11 | Revisão, slide, ensaio | 11, 12 |
| Ter 17/11, 09:00 | **Entrega** | — |

**Se estiveres atrasado:** corta primeiro o opcional (`useAlbumInfo`, extras visuais), nunca os estados de erro nem as funções puras: pesam na avaliação.

---

## 14. Quando algo corre mal: ordem de diagnóstico

Quando um número está errado ou um bloco não aparece, **procura o problema da origem para o fim**, nunca ao contrário:

1. **A API devolve o que esperas?** Abre o URL no browser ou no `/docs`.
2. **Os tipos batem com a resposta real?** Compara um registo com a `interface`.
3. **A função pura dá o resultado certo com um array pequeno?** Testa-a isolada.
4. **A store guarda o que deve?** Inspeciona o estado e o `localStorage`.
5. **O hook devolve o esperado?** Faz `console.log` do retorno.
6. **O componente mostra o que recebe?** Só aqui olhas para JSX e CSS.

Cada passo elimina uma camada inteira de hipóteses.

---

## 15. Armadilhas e soluções

| Armadilha | Sintoma | Solução |
|---|---|---|
| `useParams` devolve o nome codificado | artista "não encontrado" com espaços ou acentos | `decodeURIComponent` ao ler; `encodeURIComponent` ao criar links |
| `date_iso` é `null` ou `"nowplaying"` | `Invalid Date`, `NaN`, gráficos estranhos | `parseDataScrobble` devolve `null`; filtrar com `removerSemData` |
| "24h" contado a partir de agora | período vazio com dados antigos | contar a partir de `dataDeReferencia` (reprodução mais recente) |
| `persist` sem `skipHydration` | erro de hidratação no Next | `skipHydration: true` + reidratação manual em `useHydrated` |
| `loading` persistido | página presa a carregar após refresh | `partialize` sem `status`, ou repor `"loading"` para `"idle"` ao reidratar |
| `tags` / `similar_artists` são texto | contagens de géneros erradas, lista com um só item | `separarLista` com `trim`; normalizar maiúsculas |
| `tracklist_names` separa por `;` | faixas coladas numa só | `separarLista(texto, ";")` |
| Ranking de músicas só pelo título | músicas de artistas diferentes fundidas | chave `artista + faixa` |
| Horas locais em vez de UTC | gráfico 24h desalinhado com a API | `getUTCHours()` |
| Meses sem audições omitidos | gráfico "salta" períodos | preencher meses vazios com 0 |
| Dois pedidos iguais em simultâneo | dois `fetch` do mesmo artista | mapa de promessas em curso, fora da store |
| Cálculos pesados a cada render | interface lenta | `useMemo` com dependências corretas |

---

## 16. Checklist e avaliação

### Checklist de entrega

- [ ] Dashboard e página do artista
- [ ] Filtro de período em todo o dashboard
- [ ] Funções puras em `lib/`
- [ ] Cache Zustand persistente
- [ ] Deduplicação de pedidos
- [ ] Estados de loading, erro e não encontrado
- [ ] Gráficos Recharts
- [ ] Análise única, com a pergunta e a resposta
- [ ] Links com `encodeURIComponent`

### Como é avaliado

| Componente | O que conta |
|---|---|
| **1 · Entrega** | projeto funcional e checklist cumprido |
| **2 · Slide** | problema, solução e decisões explicados com clareza |
| **3 · Apresentação** | demonstração e defesa das escolhas |

### Peso das áreas dentro da entrega

| Área | Peso |
|---|---|
| Dashboard | 30% |
| Página do artista | 30% |
| Funções puras | 15% |
| Cache Zustand | 15% |
| Código e erros | 10% |

**Leitura estratégica:** 60% da entrega está nos dois ecrãs, mas 40% está **por baixo** (funções puras, cache, código e erros). Um ecrã bonito sobre uma base fraca perde nota; por isso a ordem deste guia começa pela base.

---

**Respira.** Começa pela etapa 1 e só avança quando cumprires o "pronto quando" de cada uma.
