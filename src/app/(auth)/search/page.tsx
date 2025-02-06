import Banner from '@/components/Banner';
import DogList from '@/components/DogList/DogList';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Banner />
      <DogList />
      <div>
        <h2>Favorited Dogs: TODO Make this a separate page</h2>

        <Link href="/favorites">review favorited dogs</Link>
      </div>
    </div>
  );
}
