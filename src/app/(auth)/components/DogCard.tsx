import { Dog } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import styled, { css } from 'styled-components';

const Card = styled.div<{ $isMatch?: boolean }>`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 15px 1px rgba(0, 0, 0, 0.4);
  max-width: 18.75rem;
  width: 100%;
  margin-inline: auto;

  @media ${({ theme }) => theme.device.tablet} {
    max-width: 11.25rem;
  }

  ${({ $isMatch, theme }) =>
    $isMatch &&
    css`
      max-width: none !important;
      flex-direction: row;
      box-shadow: none;
      border-radius: none;

      @media ${theme.device.tablet} {
        flex-direction: column;
        align-items: center;
      }
    `}
`;

const StyledImage = styled(Image)<{ $isMatch?: boolean }>`
  position: relative;
  object-fit: cover;
  object-position: center;
  width: 100%;

  ${({ $isMatch }) =>
    $isMatch &&
    css`
      border-radius: 12px;
    `}

  @media ${({ theme }) => theme.device.tablet} {
    width: 12.5rem;
    height: 11.25rem;
  }
`;

const Details = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem 1rem 2rem;
`;

const Name = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
  color: ${({ theme: { colors } }) => colors.textgray};
`;

const Detail = styled.p<{ $isMatch?: boolean }>`
  font-size: 0.75rem;
  color: ${({ theme: { colors } }) => colors.muted};
  margin-top: 0.25rem;
  margin-bottom: 0px;
  opacity: 0.7;

  span {
    color: ${({ theme: { colors } }) => colors.textgray};
    font-weight: 500;
  }

  a {
    color: ${({ theme: { colors } }) => colors.muted};
    transition: color 0.25s;

    &:hover,
    &:focus {
      color: ${({ theme: { colors } }) => colors.primary};
    }
  }

  ${({ $isMatch }) =>
    $isMatch &&
    css`
      font-size: 1rem;
      display: flex;
      gap: 0.25rem;
    `}
`;

const FavoriteButton = styled.button<{ $isFavorite?: boolean }>`
  position: absolute;
  padding: 0.25rem;
  top: 1rem;
  right: 1rem;
  height: 1.625rem;
  width: 1.625rem;
  border: none;
  border-radius: 4px;
  transition: opacity 0.25s, background-color 0.25s, filter 0.25s;

  ${({ theme: { colors }, $isFavorite }) => css`
    ${$isFavorite
      ? `background-color: ${colors.primary} !important;`
      : `background-color: transparent;`}

    &:hover {
      opacity: 0.8;
      cursor: pointer;
      background-color: ${colors.secondary};
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
  isMatch?: boolean;
};

export default function DogCard({
  dog,
  onClick,
  isFavorite,
  isMatch
}: DogCardProps) {
  return (
    <Card $isMatch={isMatch}>
      <StyledImage
        src={dog.img}
        width={300}
        height={280}
        alt={`${dog.name}'s portrait' `}
        priority
        $isMatch={isMatch}
      />

      <Details>
        {!isMatch && (
          <>
            <Name>{dog.name}</Name>
            <FavoriteButton onClick={onClick} $isFavorite={isFavorite}>
              <HeartIcon
                width={18}
                height={18}
                src={'/heart.svg'}
                alt="close button"
              />
            </FavoriteButton>
          </>
        )}

        <div>
          <Detail $isMatch={isMatch}>
            <span>Breed: </span>
            {dog.breed}
          </Detail>
          <Detail $isMatch={isMatch}>
            <span>Age: </span>
            {dog.age} Year{dog.age === 1 ? '' : 's'}
          </Detail>

          <Detail $isMatch={isMatch}>
            <span>Location: </span>
            <Link
              href={`https://www.google.com/maps/place/${dog.zip_code}`}
              target="_blank"
            >
              {dog.zip_code}
            </Link>
          </Detail>
        </div>
      </Details>
    </Card>
  );
}
