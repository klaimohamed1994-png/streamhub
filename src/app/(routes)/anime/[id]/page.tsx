import { notFound } from 'next/navigation';
import { getAnimeById } from '@/lib/anilist';
import { AnimeClient } from './AnimeClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  try {
    const anime = await getAnimeById(Number(params.id));
    const title = anime.title.english || anime.title.romaji;
    return {
      title: `${title} — StreamHub`,
      description: anime.description?.replace(/<[^>]*>/g, '').slice(0, 160),
      openGraph: { images: [anime.bannerImage || anime.coverImage.large] },
    };
  } catch {
    return { title: 'Anime — StreamHub' };
  }
}

export default async function AnimePage({ params }: Props) {
  let anime;
  try {
    anime = await getAnimeById(Number(params.id));
  } catch {
    notFound();
  }

  return <AnimeClient anime={anime} />;
}
