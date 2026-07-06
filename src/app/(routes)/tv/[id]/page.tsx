import { notFound } from 'next/navigation';
import { getShow, tmdbBackdrop } from '@/lib/tmdb';
import { TVShowClient } from './TVShowClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  try {
    const show = await getShow(Number(params.id));
    return {
      title: `${show.name} — StreamHub`,
      description: show.overview,
      openGraph: { images: [tmdbBackdrop(show.backdrop_path)] },
    };
  } catch {
    return { title: 'TV Show — StreamHub' };
  }
}

export default async function TVShowPage({ params }: Props) {
  let show;
  try {
    show = await getShow(Number(params.id));
  } catch {
    notFound();
  }

  return <TVShowClient show={show} />;
}
