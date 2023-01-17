import NextHead from 'next/head';

interface Props {
  section?: string;
}

export default function Head({ section = '' }: Props) {
  return (
    <NextHead>
      <title>{section == '' ? 'Yetaca' : `${section} - Yetaca`}</title>
      <meta name="description" content="Yet another chat app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </NextHead>
  );
}
