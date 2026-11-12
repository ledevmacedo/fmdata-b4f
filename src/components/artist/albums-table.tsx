"use client";

import { Artwork } from "@/components/dashboard/artwork";
import { SectionCard } from "@/components/dashboard/section-card";
import { CardContent } from "@/components/glaze/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/glaze/ui/table";
import { Truncate } from "@/components/glaze/ui/truncate";
import { useAlbumInfo } from "@/hooks/use-album-info";
import { formatNumber } from "@/lib/format";
import type { ArtistAlbum } from "@/types";

/** "8 de 16" quando a API diz quantas faixas o álbum tem; só "8 faixas" quando não diz. */
function AlbumRow({ artist, album }: { artist: string; album: ArtistAlbum }) {
  const info = useAlbumInfo(artist, album.name);
  const total = info.data?.track_count;
  const ouvidas = formatNumber(album.distinctTracks);

  return (
    <TableRow>
      <TableCell className="w-full max-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <Artwork name={album.name} src={album.image} size="xs" />
          <Truncate className="type-body-sm text-text-1">{album.name}</Truncate>
        </div>
      </TableCell>
      <TableCell numeric>
        {total
          ? `${ouvidas} de ${formatNumber(total)}`
          : `${ouvidas} ${album.distinctTracks === 1 ? "faixa" : "faixas"}`}
      </TableCell>
      <TableCell numeric>{formatNumber(album.scrobbles)}</TableCell>
    </TableRow>
  );
}

/** Álbuns do artista em tabela: capa e nome, faixas ouvidas do total e reproduções. */
export function AlbumsTable({
  artist,
  albuns,
}: {
  artist: string;
  albuns: ArtistAlbum[];
}) {
  return (
    <SectionCard title="Álbuns" description="Até 8">
      <CardContent flush>
        <Table frame="none" aria-label="Álbuns mais ouvidos">
          <TableHeader>
            <TableRow>
              <TableHead>Álbum</TableHead>
              <TableHead numeric>Faixas ouvidas</TableHead>
              <TableHead numeric>Scrobbles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {albuns.map((album) => (
              <AlbumRow key={album.name} artist={artist} album={album} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </SectionCard>
  );
}
