import { Dog } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import styled, { css } from 'styled-components';

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 15px 1px rgba(0, 0, 0, 0.4);
  max-width: 400px;
  width: 100%;
  margin-inline: auto;
`;

const StyledImage = styled(Image)`
  position: relative;
  object-fit: cover;
  object-position: center;
  width: 100%;
`;

const Details = styled.div`
  position: absolute;
  display: flex;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  padding: 0.25rem 1rem 0.5rem;
  margin-top: -0.625rem;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: rgba(255, 255, 255, 0.6);
`;

const Name = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
  color: ${({ theme: { colors } }) => colors.blue};
`;

const Detail = styled.p`
  font-size: 0.75rem;
  color: ${({ theme: { colors } }) => colors.muted};
  margin-top: 0.25rem;
  margin-bottom: 0px;
  opacity: 0.7;

  a {
    color: ${({ theme: { colors } }) => colors.muted};
    transition: color 0.25s;

    &:hover,
    &:focus {
      color: ${({ theme: { colors } }) => colors.success};
    }
  }
`;

const FavoriteButton = styled.button<{ $isFavorite?: boolean }>`
  position: absolute;
  padding: 0.25rem;
  top: 0.5rem;
  right: 0.5rem;
  height: 1.625rem;
  width: 1.625rem;
  border: none;
  border-radius: 4px;
  transition: opacity 0.25s, background-color 0.25s, filter 0.25s;
  filter: invert(100%);

  ${({ theme: { colors }, $isFavorite }) => css`
    ${$isFavorite
      ? `filter: none; background-color: ${colors.success};`
      : `background-color: transparent;`}

    &:hover,
    &:focus {
      opacity: 0.8;
      cursor: pointer;
      filter: none;
    }
  `}
`;

const HeartIcon = styled(Image)`
  width: 100%;
  height: auto;
  cursor: pointer;
  object-fit: contain;
`;

type DogCardProps = {
  dog: Dog;
  onClick?: () => void;
  isFavorite?: boolean;
  disabled?: boolean;
};

export default function DogCard({
  dog,
  onClick,
  isFavorite,
  disabled
}: DogCardProps) {
  return (
    <Card>
      <StyledImage
        src={dog.img}
        width={300}
        height={280}
        alt={`${dog.name}'s portrait' `}
        priority
      />
      {!disabled && (
        <FavoriteButton onClick={onClick} $isFavorite={isFavorite}>
          <HeartIcon
            width={18}
            height={18}
            src={'/heart.svg'}
            alt="close button"
          />
        </FavoriteButton>
      )}

      <Details>
        <Name>{dog.name}</Name>
        <div>
          <Detail>
            {dog.breed} • {dog.age} Year{dog.age === 1 ? '' : 's'}
          </Detail>

          <Detail>
            <Link
              href={`https://www.google.com/maps/place/${dog.zip_code}`}
              target="_blank"
            >
              Location • {dog.zip_code}
            </Link>
          </Detail>
        </div>
      </Details>
    </Card>
  );
}
